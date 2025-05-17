using Pixly.Models.Request;
using Pixly.Services.Database;

namespace Pixly.Services.Interfaces
{
    public interface IUserService
    {
        Task<User> CreateUserAsync(RegisterRequest request);
    }
}
