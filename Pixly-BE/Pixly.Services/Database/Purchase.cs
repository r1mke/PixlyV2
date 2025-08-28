
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pixly.Services.Database
{
    [Table("Purchases")]
    public class Purchase
    {
        [Key]
        public int PurchaseId { get; set; }

        [Required]
        public int PhotoId { get; set; }

        [Required]
        [MaxLength(450)]
        public string UserId { get; set; }

        [Required]
        [MaxLength(255)]
        public string StripeSessionId { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Amount { get; set; }

        [Required]
        [MaxLength(3)]
        public string Currency { get; set; } = "USD";

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "Pending"; // Pending, Completed, Cancelled, Refunded

        [Required]
        public DateTime CreatedAt { get; set; }

        public DateTime? PurchasedAt { get; set; }

        public DateTime? RefundedAt { get; set; }

        // Navigation properties
        [ForeignKey("PhotoId")]
        public virtual Photo Photo { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }
    }
}