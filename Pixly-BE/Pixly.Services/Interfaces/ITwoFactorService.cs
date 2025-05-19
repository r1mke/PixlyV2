using Pixly.Models.Request;
using Pixly.Models.Response;

namespace Pixly.Services.Interfaces
{
    public interface ITwoFactorService
    {
        Task<bool> SetupTwoFactorAsync(string userId);
        Task<string> GenerateTwoFactorCodeAsync(string userId);
        Task<AuthResponse> ValidateTwoFactorAsync(TwoFactorRequest request);
    }
}
