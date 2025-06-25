using Pixly.Models.Request;
using Pixly.Models.Response;
using Pixly.Models.SearchRequest;
using Pixly.Models.UpdateRequest;

namespace Pixly.Services.Interfaces
{
    public interface IUserService : ICRUDService<Models.DTOs.User, Models.DTOs.User, UserSearchRequest, Models.DTOs.User, UserUpdateRequest, string>
    {
        Task<Database.User> CreateUserAsync(RegisterRequest request);
        Task<(bool Succeeded, Database.User User, bool Requires2FA, bool EmailConfirmed)> VerifyCredentialsAsync(string email, string password);
        Task<string> GenerateEmailConfirmationTokenAsync(string userId);
        Task<bool> ConfirmEmailAsync(string userId, string token);
        Task<Database.User> GetUserByEmailAsync(string email);
        Task<string> GetUserEmailByIdAsync(string userId);
        Task<CurrentUserResponse> GetCurrentUserAsync(string userId);
    }
}
