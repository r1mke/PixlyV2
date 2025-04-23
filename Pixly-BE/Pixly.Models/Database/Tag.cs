using System.ComponentModel.DataAnnotations;

namespace Pixly.Models.Database
{
    public class Tag
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public ICollection<PhotoTag> PhotoTags { get; set; } = new List<PhotoTag>();
    }
}