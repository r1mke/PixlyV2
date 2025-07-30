namespace Pixly.Models.AdminDTO
{
    public class DashboardOverview
    {
        public int TotalUsers { get; set; }
        public int TotalPhotos { get; set; }
        public int TotalLikes { get; set; }
        public int TotalDownload { get; set; }
        public int PendingPhotos { get; set; }
        public List<DailyUploadedPhotos> LastFewDayInfo { get; set; } = new();
    }
}
