using Microsoft.Extensions.Logging;
using Pixly.Models.Request;
using Pixly.Models.Response;
using Pixly.Services.Database;
using Pixly.Services.Interfaces;

namespace Pixly.Services.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserService _userService;
        private readonly ILogger<IAuthService> _logger;

        public AuthService(IUserService userService, ILogger<IAuthService> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        public async Task<(User, RegisterResponse)> RegisterAsync(RegisterRequest request)
        {
            _logger.LogInformation("Starting registration for email {Email}", request.Email);

            var user = await _userService.CreateUserAsync(request);

            var response = new RegisterResponse
            {
                UserId = user.Id,
                Email = user.Email,
            };

            _logger.LogInformation("Registration successful for user {Email}", user.Email);
            return (user, response);
        }
    }
}
