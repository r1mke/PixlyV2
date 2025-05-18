using Pixly.Models.Request;
using Pixly.Models.Response;
using Pixly.Services.Database;

namespace Pixly.Services.Interfaces
{
    public interface IUserService
    {
        Task<User> CreateUserAsync(RegisterRequest request);
        Task<(bool Succeeded, User User, bool Requires2FA, bool EmailConfirmed)> VerifyCredentialsAsync(string email, string password);
        Task<string> GenerateEmailConfirmationTokenAsync(string userId);
        Task<bool> ConfirmEmailAsync(string userId, string token);
        Task<User> GetUserByEmailAsync(string email);
        Task<string> GetUserEmailByIdAsync(string userId);
        Task<CurrentUserResponse> GetCurrentUserAsync(string userId);
    }
}
