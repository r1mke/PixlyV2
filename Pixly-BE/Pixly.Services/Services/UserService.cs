using MapsterMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Pixly.Models.Request;
using Pixly.Services.Database;
using Pixly.Services.Exceptions;
using Pixly.Services.Interfaces;

namespace Pixly.Services.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<User> _userManager;
        private readonly ILogger<UserService> _logger;
        private readonly IMapper _mapper;

        public UserService(UserManager<User> userManager, ILogger<UserService> logger, IMapper mapper)
        {
            _userManager = userManager;
            _logger = logger;
            _mapper = mapper;
        }

        /// Helper Methods
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

        /// CRUD Methods
        public async Task<User> CreateUserAsync(RegisterRequest request)
        {
            var existingUser = GetUserAsync(request.Email, byEmail: true, throwIfNotFound: false);
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
    }
}
