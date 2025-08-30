using Pixly.Models.DTOs;
using Stripe.Checkout;


namespace Pixly.Services.Interfaces
{
    public interface IStripeService
    {
        Task<Session> CreatePhotoCheckoutSessionAsync(int photoId, string userId, decimal amount, string successUrl, string cancelUrl);
        Task<bool> VerifyPaymentAsync(string sessionId);
        Task<PaymentResult> ProcessPaymentWebhookAsync(string payload, string signature);
        Task<List<Purchase>> GetUserPurchasesAsync(string userId);
        Task<Purchase> GetPurchaseBySessionIdAsync(string sessionId);
    }
}