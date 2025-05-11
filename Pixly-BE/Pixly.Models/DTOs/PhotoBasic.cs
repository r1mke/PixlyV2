namespace Pixly.Models.DTOs
{
    public class PhotoBasic
    {
        public string Title { get; set; }
        public string Url { get; set; }
        public User? User { get; set; }
        public string? State { get; set; }
        public string Orientation { get; set; }
    }
}
