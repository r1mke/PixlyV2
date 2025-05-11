namespace Pixly.Models.DTOs
{
    public class PhotoDetail
    {

        public string Title { get; set; }
        public string? Description { get; set; }
        public string Url { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public long FileSize { get; set; }
        public string Format { get; set; }
        public DateTime UploadedAt { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public string? State { get; set; }
        public int ViewCount { get; set; }
        public int LikeCount { get; set; }
        public int DownloadCount { get; set; }
        public string Orientation { get; set; }
        public ICollection<PhotoTag> PhotoTags { get; set; } = new List<PhotoTag>();

    }
}
