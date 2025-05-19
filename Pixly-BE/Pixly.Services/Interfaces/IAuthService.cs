using Pixly.Models.Request;
using Pixly.Models.Response;
using Pixly.Services.Database;

namespace Pixly.Services.Interfaces
{
    public interface IAuthService
    {
        Task<(User User, RegisterResponse Response)> RegisterAsync(RegisterRequest request);
        Task<AuthResponse> RefreshTokenAsync(RefreshTokenRequest request, string ipAddress = null);
        Task<AuthResponse> LoginAsync(LoginRequest request, string ipAddress = null);
        Task<bool> LogoutAsync(string userId, string refreshToken = null);
    }
}
