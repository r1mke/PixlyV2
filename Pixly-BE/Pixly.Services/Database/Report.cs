namespace Pixly.Services.Database
{
    public class Report
    {
        public int ReportId { get; set; }

        public string ReportTitle { get; set; }
        public string ReportMessage { get; set; }

        public User ReportedByUser { get; set; }
        public User ReportedUser { get; set; }
        public Photo Photo { get; set; }
        public ReportType ReportType { get; set; }
        public ReportStatus Status { get; set; }

        public string ReportedByUserId { get; set; }
        public string ReportedUserId { get; set; }
        public int PhotoId { get; set; }
        public int ReportTypeId { get; set; }
        public int ReportStatusId { get; set; } = 1;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string? AdminNotes { get; set; }
        public string? AdminUserId { get; set; }
        public User? AdminUser { get; set; }
        public DateTime? ResolvedAt { get; set; }

        public bool IsDeleted { get; set; } = false;
    }

}
