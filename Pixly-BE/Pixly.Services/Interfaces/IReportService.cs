using Pixly.Models.DTOs;
using Pixly.Models.InsertRequest;
using Pixly.Models.SearchRequest;
using Pixly.Models.UpdateRequest;
namespace Pixly.Services.Interfaces
{
    public interface IReportService : ICRUDService<Report, Report, ReportSearchRequest, ReportInsertRequest, ReportUpdateRequest, int>
    {

    }
}
