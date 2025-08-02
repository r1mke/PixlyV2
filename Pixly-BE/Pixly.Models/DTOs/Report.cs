namespace Pixly.Models.DTOs
{
    public class Report
    {
        public string ReportMessage { get; set; }
        public User User { get; set; }
        public PhotoBasic Photo { get; set; }
        public DateTime CreatedAt { get; set; }

    }
}
