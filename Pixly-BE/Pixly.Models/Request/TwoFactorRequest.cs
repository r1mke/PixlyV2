using System.ComponentModel.DataAnnotations;

namespace Pixly.Models.Request
{
    public class TwoFactorRequest
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string TwoFactorCode { get; set; }
    }
}
