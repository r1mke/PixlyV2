using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using Pixly.Models.AdminDTO;
using Pixly.Models.SearchRequest;
using Pixly.Services.Database;
using Pixly.Services.Interfaces;

namespace Pixly.Services.Services
{
    public class AdminService : IAdminService
    {
        protected readonly ApplicationDbContext _context;
        public IMapper Mapper;

        public AdminService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            Mapper = mapper;
        }

        public async Task<DashboardOverview> GetDashboardOverview(DashboardOverviewSearchRequest request)
        {
            DateTime sinceDate = DateTime.UtcNow;

            sinceDate = DateTime.UtcNow.AddDays(-request.NumberOfDays);
            var TotalOverview = await GetTotalInfo(sinceDate);

            List<DailyUploadedPhotos> DailyUploadedPhotos = new List<DailyUploadedPhotos>();
            DailyUploadedPhotos = await GetLastFewDayUploadedPhotos(request.NumberOfDays);

            DashboardOverview dashboardOverview = new DashboardOverview();

            Mapper.Map(TotalOverview, dashboardOverview);

            dashboardOverview.LastFewDayInfo = DailyUploadedPhotos;

            return dashboardOverview;
        }

        private async Task<DashboardOverview> GetTotalInfo(DateTime sinceDate)
        {
            var totalUsers = await _context.Users.Where(user => user.CreatedAt >= sinceDate).CountAsync();
            var totalPhotos = await _context.Photos.Where(img => img.UploadedAt >= sinceDate && img.State == "Approved").CountAsync();
            var totalLikes = await _context.Likes.Where(like => like.LikedAt >= sinceDate).CountAsync();
            var pendingPhotos = await _context.Photos.Where(img => img.UploadedAt >= sinceDate && img.State == "Pending").CountAsync();
            var totalDownload = 10;

            var dashboardOverview = new DashboardOverview()
            {
                TotalUsers = totalUsers,
                TotalPhotos = totalPhotos,
                TotalLikes = totalLikes,
                TotalDownload = totalDownload,
                PendingPhotos = pendingPhotos
            };

            return dashboardOverview;
        }

        private async Task<List<DailyUploadedPhotos>> GetLastFewDayUploadedPhotos(double NumberOfDays)
        {
            List<DailyUploadedPhotos> result = new();


            for (var i = 0; i < NumberOfDays; i++)
            {
                DateOnly targetDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-i));

                DateTime startOfDay = targetDate.ToDateTime(TimeOnly.MinValue);
                DateTime endOfDay = targetDate.ToDateTime(TimeOnly.MaxValue);

                var NumberOfPhotos = await _context.Photos
                    .Where(photo => photo.UploadedAt >= startOfDay &&
                           photo.UploadedAt <= endOfDay &&
                           photo.State == "Approved")
                    .CountAsync();

                DailyUploadedPhotos dailyUploadedPhotos = new DailyUploadedPhotos()
                {
                    NumberOfPhotos = NumberOfPhotos,
                    Day = targetDate
                };

                result.Add(dailyUploadedPhotos);
            }

            return result;
        }
    }
}
