namespace Pixly.Models.DTOs
{
    public class Report
    {
        public string ReportMessage { get; set; }
        public string ReportTitle { get; set; }
        public User ReportedByUser { get; set; }
        public User ReportedUser { get; set; }
        public ReportType ReportType { get; set; }
        public PhotoBasic Photo { get; set; }
        public DateTime CreatedAt { get; set; }

    }
}
