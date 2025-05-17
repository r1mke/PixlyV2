using Pixly.Models.Request;
using Pixly.Models.Response;

namespace Pixly.Services.Interfaces
{
    public interface IAuthService
    {
        Task<RegisterResponse> RegisterAsync(RegisterRequest request);
    }
}
