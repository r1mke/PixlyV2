using Mapster;
using MapsterMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pixly.Models.Request;
using Pixly.Models.Response;
using Pixly.Models.SearchRequest;
using Pixly.Models.UpdateRequest;
using Pixly.Services.Database;
using Pixly.Services.Exceptions;
using Pixly.Services.Interfaces;

namespace Pixly.Services.Services
{
    public class UserService : CRUDService<Models.DTOs.User, Models.DTOs.User, UserSearchRequest, Models.DTOs.User, UserUpdateRequest, Database.User, string>, IUserService
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly ILogger<UserService> _logger;
        private readonly IMapper _mapper;
        private readonly ICloudinaryService _cloudinaryService;

        public UserService(UserManager<User> userManager, SignInManager<User> signInManager, ILogger<UserService> logger, IMapper mapper, ApplicationDbContext context, ICacheService cacheService, ICloudinaryService cloudinaryService)
            : base(mapper, context, cacheService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = logger;
            _mapper = mapper;
            _cloudinaryService = cloudinaryService;
        }

        /// Helper Method
        private async Task<User> GetUserAsync(string identifier, bool byEmail = false, bool throwIfNotFound = true)
        {
            var user = byEmail
                ? await _userManager.FindByEmailAsync(identifier)
                : await _userManager.FindByIdAsync(identifier);

            if (user == null)
            {
                var idType = byEmail ? "email" : "ID";
                _logger.LogWarning("User with {IdType} {Identifier} not found", idType, identifier);

                if (throwIfNotFound)
                    throw new NotFoundException(byEmail
                        ? $"User with email '{identifier}' not found"
                        : $"User with ID '{identifier}' not found");

            }

            return user;
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            return await GetUserAsync(email, byEmail: true, throwIfNotFound: false);
        }

        public async Task<string> GetUserEmailByIdAsync(string userId)
        {
            var user = await GetUserAsync(userId, throwIfNotFound: true);
            return user.Email;
        }

        public async Task<User> CreateUserAsync(RegisterRequest request)
        {
            var existingUser = await GetUserAsync(request.Email, byEmail: true, throwIfNotFound: false);
            if (existingUser != null)
            {
                _logger.LogWarning("User with email {Email} already exists", request.Email);
                throw new ConflictException($"User with email {request.Email} already exists");
            }

            var user = _mapper.Map<User>(request);
            user.UserName = request.Email;
            user.CreatedAt = DateTime.UtcNow;
            user.IsActive = true;
            user.TwoFactorEnabled = false;
            user.EmailConfirmed = false;

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
            {
                var errorMessage = string.Join(", ", result.Errors.Select(e => e.Description));
                _logger.LogError("User creation failed: {Errors}", errorMessage);
                throw new ValidationException(errorMessage, null);
            }

            await _userManager.AddToRoleAsync(user, "User");
            _logger.LogInformation("User {Email} created successfully", request.Email);
            return user;
        }

        public async Task<(bool Succeeded, User User, bool Requires2FA, bool EmailConfirmed)> VerifyCredentialsAsync(string email, string password)
        {
            var user = await GetUserAsync(email, byEmail: true, throwIfNotFound: false);
            if (user == null)
                return (false, null, false, true);

            var result = await _signInManager.CheckPasswordSignInAsync(user, password, false);
            if (!result.Succeeded)
            {
                _logger.LogWarning("Failed login for user {Email} - invalid password", email);
                return (false, null, false, true);
            }

            bool emailConfirmed = user.EmailConfirmed;
            if (emailConfirmed)
                _logger.LogInformation("Login for user {Email} with confirmed email", email);

            if (user.TwoFactorEnabled)
            {
                _logger.LogInformation("Login requires 2FA for user {Email}", email);
                return (true, user, true, emailConfirmed);
            }

            _logger.LogInformation("Successful login for user {Email}", email);
            return (true, user, false, emailConfirmed);
        }

        public async Task<CurrentUserResponse> GetCurrentUserAsync(string userId)
        {
            var user = await GetUserAsync(userId, throwIfNotFound: true);
            var roles = await _userManager.GetRolesAsync(user);

            var currentUserResponse = _mapper.Map<CurrentUserResponse>(user);
            currentUserResponse.Roles = roles.ToList();
            currentUserResponse.IsTwoFactorEnabled = user.TwoFactorEnabled;
            currentUserResponse.EmailConfirmed = user.EmailConfirmed;

            return currentUserResponse;
        }

        public async Task<string> GenerateEmailConfirmationTokenAsync(string userId)
        {
            var user = await GetUserAsync(userId, throwIfNotFound: true);
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            _logger.LogInformation("Email confirmation token generated for user {Email}", user.Email);
            return token;
        }

        public async Task<bool> ConfirmEmailAsync(string userId, string token)
        {
            var user = await GetUserAsync(userId, throwIfNotFound: true);
            var result = await _userManager.ConfirmEmailAsync(user, token);

            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                _logger.LogWarning("Failed to confirm email for user {Email}: {Errors}", user.Email, errors);
                return false;
            }

            _logger.LogInformation("Email confirmed for user {Email}", user.Email);
            return true;
        }

        protected override async Task<IQueryable<User>> AddFilter(IQueryable<User> query, UserSearchRequest? search)
        {
            if (!string.IsNullOrWhiteSpace(search?.Email))
            {
                query = query.Where(x => x.Email.StartsWith(search.Email));
            }
            if (!string.IsNullOrWhiteSpace(search?.UserName))
            {
                query = query.Where(x => x.UserName.StartsWith(search.UserName));
            }
            if (!string.IsNullOrWhiteSpace(search?.LastName))
            {
                query = query.Where(x => x.LastName.StartsWith(search.LastName));
            }
            if (!string.IsNullOrWhiteSpace(search?.FirstName))
            {
                query = query.Where(x => x.FirstName.StartsWith(search.FirstName));
            }
            return query;
        }

        public override async Task<Models.DTOs.User> Update(string id, UserUpdateRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == id);
            if (user == null)
                throw new NotFoundException($"User with ID {id} not found");

            var config = new TypeAdapterConfig();
            config.ForType<UserUpdateRequest, User>()
                  .IgnoreNullValues(true);

            request.Adapt(user, config);

            if (request.ProfilePictureUrl != null)
            {
                var imageUrl = await _cloudinaryService.UploadProfilePhoto(request.ProfilePictureUrl);
                user.ProfilePictureUrl = imageUrl;
            }

            if (request.RemoveProfilePicture)
            {
                user.ProfilePictureUrl = null;
            }


            await _context.SaveChangesAsync();
            return _mapper.Map<Models.DTOs.User>(user);
        }

    }
}
