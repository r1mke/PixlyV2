namespace Pixly.Services.Database
{
    public class Tag
    {
        public int TagId { get; set; }
        public string Name { get; set; }
        public ICollection<PhotoTag> PhotoTags { get; set; } = new List<PhotoTag>();
    }
}