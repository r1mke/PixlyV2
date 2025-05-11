namespace Pixly.Models.DTOs
{
    public class PhotoTag
    {
        public int PhotoId { get; set; }
        public int TagId { get; set; }
        public Tag Tag { get; set; }
    }
}
