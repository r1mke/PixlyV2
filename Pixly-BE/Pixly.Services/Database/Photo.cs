namespace Pixly.Services.Database
{
    public class Photo
    {
        public int PhotoId { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public string Url { get; set; }
        public string? PublicId { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public string? Format { get; set; }
        public long FileSize { get; set; }
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
        public int UserId { get; set; }
        public User? User { get; set; }
        public string? State { get; set; }
        public int ViewCount { get; set; } = 0;
        public int LikeCount { get; set; } = 0;
        public int DownloadCount { get; set; } = 0;
        public string Orientation { get; set; }
        public bool IsDeleted { get; set; } = false;
        public ICollection<PhotoTag> PhotoTags { get; set; } = new List<PhotoTag>();
        public ICollection<Like> Likes { get; set; } = new List<Like>();
        public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
    }
}