namespace Pixly.Services.Database
{
    public class Report
    {
        public int ReportId { get; set; }
        public string ReportTitle { get; set; }
        public string ReportMessage { get; set; }
        public User User { get; set; }
        public string UserId { get; set; }
        public int PhotoId { get; set; }
        public Photo Photo { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
