namespace Pixly.Services.Database
{
    public class PhotoTag
    {
        public int PhotoTagId { get; set; }
        public int PhotoId { get; set; }
        public Photo Photo { get; set; }

        public int TagId { get; set; }
        public Tag Tag { get; set; }
    }
}