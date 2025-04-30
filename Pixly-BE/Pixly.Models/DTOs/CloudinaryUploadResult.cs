namespace Pixly.Models.DTOs
{
    public class CloudinaryUploadResult
    {
        public string Url { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public long FileSizeInBytes { get; set; }
        public string Format { get; set; }
        public string Orientation { get; set; }
    }
}
