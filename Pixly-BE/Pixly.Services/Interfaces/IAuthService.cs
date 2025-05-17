using Pixly.Models.Request;
using Pixly.Models.Response;
using Pixly.Services.Database;

namespace Pixly.Services.Interfaces
{
    public interface IAuthService
    {
        Task<(User User, RegisterResponse Response)> RegisterAsync(RegisterRequest request);
    }
}
