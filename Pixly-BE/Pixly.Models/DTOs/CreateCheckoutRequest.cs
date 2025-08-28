namespace Pixly.Models.DTOs
{
    public class CreateCheckoutRequest
    {
        public int PhotoId { get; set; }
        public decimal Amount { get; set; }
        public string SuccessUrl { get; set; }
        public string CancelUrl { get; set; }
    }
}
