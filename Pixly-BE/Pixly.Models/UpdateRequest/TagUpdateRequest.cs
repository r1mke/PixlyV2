using System.ComponentModel.DataAnnotations;

namespace Pixly.Models.UpdateRequest
{
    public class TagUpdateRequest
    {
        [Required(ErrorMessage = "Tag name is required.")]
        [MinLength(3, ErrorMessage = "Tag name cannot be less than 3 characters.")]
        public string Name { get; set; }
    }
}
