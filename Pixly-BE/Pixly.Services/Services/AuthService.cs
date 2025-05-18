using Microsoft.Extensions.Logging;
using Pixly.Models.Request;
using Pixly.Models.Response;
using Pixly.Services.Database;
using Pixly.Services.Exceptions;
using Pixly.Services.Interfaces;
using System.Security.Authentication;

namespace Pixly.Services.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserService _userService;
        private readonly ITwoFactorService _twoFactorService;
        private readonly ITokenService _tokenService;
        private readonly IEmailService _emailService;
        private readonly ILogger<IAuthService> _logger;

        public AuthService(IUserService userService, ITokenService tokenService, ILogger<IAuthService> logger, ITwoFactorService twoFactorService, IEmailService emailService)
        {
            _userService = userService;
            _tokenService = tokenService;
            _twoFactorService = twoFactorService;
            _emailService = emailService;
            _logger = logger;
            _twoFactorService = twoFactorService;
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

        public async Task<AuthResponse> RefreshTokenAsync(RefreshTokenRequest request, string ipAddress = null)
        {
            try
            {
                var user = await _tokenService.ValidateRefreshTokenAsync(request.Token, request.RefreshToken, ipAddress);

                var result = await _tokenService
                    .RotateRefreshTokenAsync(request.Token, request.RefreshToken, user.Id, ipAddress);

                _logger.LogInformation("Token successfully refreshed for user {Email}", user.Email);

                return new AuthResponse
                {
                    Token = result.Token,
                    RefreshToken = result.RefreshToken,
                    Expiration = result.Expiration,
                    RequiresTwoFactor = false,
                    EmailConfirmed = user.EmailConfirmed
                };
            }
            catch (SecurityException ex)
            {
                _logger.LogWarning("Security exception during token refresh: {Message}", ex.Message);
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Error occurred while refreshing token");
                throw;
            }
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request, string ipAddress = null)
        {
            _logger.LogInformation("Starting login for email {Email}", request.Email);

            var (succeeded, user, requiresTwoFactor, emailConfirmed) = await _userService.VerifyCredentialsAsync(request.Email, request.Password);

            if (!succeeded)
            {
                _logger.LogWarning("Failed login attempt for email {Email} - invalid credentials", request.Email);
                throw new AuthenticationException("Invalid email or password.");
            }

            if (requiresTwoFactor)
            {
                _logger.LogInformation("Login requires 2FA for user {Email}", request.Email);

                var code = await _twoFactorService.GenerateTwoFactorCodeAsync(user.Id);

                _emailService.Queue2FACodeAsync(user.Email, code);

                return new AuthResponse
                {
                    RequiresTwoFactor = true,
                    EmailConfirmed = emailConfirmed,
                    RefreshToken = string.Empty
                };
            }

            var jwtToken = await _tokenService.GenerateJwtTokenAsync(user);
            var refreshToken = await _tokenService.GenerateRefreshTokenAsync(user, ipAddress);

            var response = new AuthResponse
            {
                Token = jwtToken,
                RefreshToken = refreshToken,
                Expiration = DateTime.UtcNow.AddMinutes(15),
                RequiresTwoFactor = false,
                EmailConfirmed = emailConfirmed
            };

            if (emailConfirmed)
            {
                _logger.LogInformation("Login successful for user {Email} with unconfirmed email", user.Email);
            }
            else
            {
                _logger.LogInformation("Login successful for user {Email}", user.Email);
            }

            return response;
        }

        public async Task<bool> LogoutAsync(string userId, string refreshToken = null)
        {
            _logger.LogInformation("Starting logout for user {UserId}", userId);

            try
            {
                if (!string.IsNullOrEmpty(refreshToken))
                {
                    await _tokenService.RevokeRefreshTokenAsync(refreshToken, userId);
                    _logger.LogInformation("Specific refresh token revoked for user {UserId}", userId);
                }
                else
                {
                    await _tokenService.RevokeAllRefreshTokensAsync(userId);
                    _logger.LogInformation("All refresh tokens revoked for user {UserId}", userId);
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Error occurred while logging out user {UserId}", userId);
                throw;
            }
        }
    }
}
