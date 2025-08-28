namespace Pixly.Models.DTOs
{
    public class PaymentResult
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public string SessionId { get; set; }
        public string ErrorCode { get; set; }
    }
}
