using Microsoft.AspNetCore.Mvc;
using Pixly.Services.Interfaces;

namespace Pixly.API.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;
    }
}
