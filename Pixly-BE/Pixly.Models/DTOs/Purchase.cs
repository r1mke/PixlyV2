namespace Pixly.Models.DTOs
{
    public class Purchase
    {
        public int PurchaseId { get; set; }
        public int PhotoId { get; set; }
        public string UserId { get; set; }
        public string StripeSessionId { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? PurchasedAt { get; set; }

        // Navigation properties
        public PhotoBasic Photo { get; set; }
        public User User { get; set; }
    }
}
