using System.ComponentModel.DataAnnotations;

namespace Pixly.Models.InsertRequest
{
    public class ReportInsertRequest
    {
        [Required(ErrorMessage = "Report title is required.")]
        [StringLength(30, ErrorMessage = "Report title cannot be longer than 30 characters.")]
        public string ReportTitle { get; set; }

        [Required(ErrorMessage = "Report message is required.")]
        [StringLength(100, ErrorMessage = "Report message cannot be longer than 30 characters.")]
        public string ReportMessage { get; set; }
        [Required(ErrorMessage = "User ID is required.")]
        public string UserId { get; set; }
        [Required(ErrorMessage = "Photo ID is required.")]
        public int PhotoId { get; set; }
    }
}
