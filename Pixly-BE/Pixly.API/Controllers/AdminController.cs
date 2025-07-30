using Microsoft.AspNetCore.Mvc;
using Pixly.API.Exstensions;
using Pixly.Models.AdminDTO;
using Pixly.Models.DTOs;
using Pixly.Models.SearchRequest;
using Pixly.Services.Interfaces;

namespace Pixly.API.Controllers
{
    [Route("api/admin")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<DashboardOverview>>> GetOverview([FromQuery] DashboardOverviewSearchRequest request)
        {
            var result = await _adminService.GetDashboardOverview(request);

            if (result == null) return this.ApiNotFound<DashboardOverview>();

            return this.ApiSuccess<DashboardOverview>(result);
        }
    }
}
