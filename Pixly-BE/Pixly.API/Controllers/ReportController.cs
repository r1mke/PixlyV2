using Microsoft.AspNetCore.Mvc;
using Pixly.API.Exstensions;
using Pixly.Models.DTOs;
using Pixly.Models.InsertRequest;
using Pixly.Models.SearchRequest;
using Pixly.Models.UpdateRequest;
using Pixly.Services.Interfaces;

namespace Pixly.API.Controllers
{
    [Route("api/report")]
    public class ReportController : CRUDController<Report, Report, ReportSearchRequest, ReportInsertRequest, ReportUpdateRequest, int>
    {
        public ReportController(IReportService service) : base(service)
        {
        }

        [HttpGet("reportTypes")]
        public async Task<ActionResult<ApiResponse<List<ReportType>>>> GetAllReportTypes()
        {
            var result = await (_service as IReportService).GetAllReports();
            return this.ApiSuccess(result);
        }
    }
}
