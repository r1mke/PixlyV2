namespace Pixly.Models.UpdateRequest
{
    public class ReportUpdateRequest
    {
        public int ReportStatusId { get; set; }
        public string? AdminNotes { get; set; }
        public string AdminUserId { get; set; }
        public DateTime ResolvedAt { get; set; } = DateTime.UtcNow;
        public bool? IsDeleted { get; set; }
    }
}
