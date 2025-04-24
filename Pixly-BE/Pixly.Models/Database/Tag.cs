using System.ComponentModel.DataAnnotations;

namespace Pixly.Models.Database
{
    public class Tag
    {
        public int TagId { get; set; }

        [Required]
        public string Name { get; set; }

        public ICollection<PhotoTag> PhotoTags { get; set; } = new List<PhotoTag>();
    }
}