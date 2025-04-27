using System.ComponentModel.DataAnnotations;

namespace Pixly.Models.UpdateRequest
{
    public class PhotoUpdateRequest
    {
        [Required(ErrorMessage = "Title is required.")]
        [StringLength(30, ErrorMessage = "Title cannot be longer than 30 characters.")]
        public string Title { get; set; }

        [StringLength(100, ErrorMessage = "Description cannot be longer than 100 characters.")]
        public string? Description { get; set; }
    }
}
