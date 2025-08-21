using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Pixly.Models.InsertRequest
{
    public class PhotoInsertRequest
    {
        [Required(ErrorMessage = "Title is required.")]
        [StringLength(30, ErrorMessage = "Title cannot be longer than 30 characters.")]
        public string Title { get; set; }

        [StringLength(100, ErrorMessage = "Description cannot be longer than 1000 characters.")]
        public string? Description { get; set; }

        [Required(ErrorMessage = "User ID is required.")]
        //[Range(1, int.MaxValue, ErrorMessage = "Invalid user ID.")]
        public string UserId { get; set; }

        [Required(ErrorMessage = "Price is required.")]
        public int Price { get; set; }

        [Required(ErrorMessage = "File is required.")]
        public IFormFile File { get; set; }

        [Required(ErrorMessage = "At least one tag must be selected.")]
        [MinLength(1, ErrorMessage = "At least one tag must be selected.")]
        public List<string> Tags { get; set; } = new();

        public bool? IsDraft { get; set; }

    }
}
