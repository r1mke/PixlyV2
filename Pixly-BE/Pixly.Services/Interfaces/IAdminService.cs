using Pixly.Models.AdminDTO;
using Pixly.Models.SearchRequest;

namespace Pixly.Services.Interfaces
{
    public interface IAdminService
    {
        Task<DashboardOverview> GetDashboardOverview(DashboardOverviewSearchRequest request);

    }
}
