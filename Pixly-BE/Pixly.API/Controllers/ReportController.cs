using Microsoft.AspNetCore.Mvc;
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
    }
}
