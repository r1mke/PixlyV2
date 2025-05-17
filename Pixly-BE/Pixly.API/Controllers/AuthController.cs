using Microsoft.AspNetCore.Mvc;
using Pixly.Models.DTOs;
using Pixly.Models.Request;
using Pixly.Models.Response;
using Pixly.Services.Interfaces;

namespace Pixly.API.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<ActionResult<ApiResponse<RegisterResponse>>> Register([FromBody] RegisterRequest request)
        {
            var result = await _authService.RegisterAsync(request);

            return Ok(ApiResponse<RegisterResponse>.SuccessResponse(
                new RegisterResponse
                {
                    UserId = result.User.Id,
                    Email = result.User.Email,
                },
                "Registration successful. Please check your email to confirm your account. You're now logged in."));
        }
    }
}
