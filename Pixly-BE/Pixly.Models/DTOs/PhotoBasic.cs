namespace Pixly.Models.DTOs
{
    public class PhotoBasic
    {
        public int PhotoId { get; set; }
        public string Title { get; set; }
        public string Url { get; set; }
        public string Slug { get; set; }
        public UserBasic? User { get; set; }
        public string? State { get; set; }
        public string Orientation { get; set; }
        public bool IsCurrentUserLiked { get; set; }
        public bool IsCurrentUserSaved { get; set; }
    }
}
