using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pixly.Models.DTOs;
using Pixly.Services.Services;
using System.Security.Claims;

namespace Pixly.API.Controllers
{
    [ApiController]
    [Route("api/payment")]
    public class PaymentController : ControllerBase
    {
        private readonly StripeService _stripeService;
        private readonly ILogger<PaymentController> _logger;

        public PaymentController(StripeService stripeService, ILogger<PaymentController> logger)
        {
            _stripeService = stripeService;
            _logger = logger;
        }

        [HttpPost("create-checkout-session")]
        [Authorize]
        public async Task<ActionResult<CheckoutResponse>> CreateCheckoutSession([FromBody] CreateCheckoutRequest request)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized("User ID not found in token");

                var session = await _stripeService.CreatePhotoCheckoutSessionAsync(
                    request.PhotoId,
                    userId,
                    request.Amount,
                    request.SuccessUrl,
                    request.CancelUrl);

                return Ok(new CheckoutResponse
                {
                    SessionId = session.Id,
                    CheckoutUrl = session.Url
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating checkout session for photo {PhotoId}", request.PhotoId);
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("verify-payment/{sessionId}")]
        [Authorize]
        public async Task<ActionResult<bool>> VerifyPayment(string sessionId)
        {
            try
            {
                var isVerified = await _stripeService.VerifyPaymentAsync(sessionId);
                return Ok(new { success = isVerified });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error verifying payment for session {SessionId}", sessionId);
                return BadRequest(new { message = ex.Message });
            }
        }

        // Webhook endpoint removed - using manual verification instead
        // [HttpPost("webhook")]
        // [AllowAnonymous] 
        // public async Task<IActionResult> HandleWebhook() { ... }

        [HttpGet("purchases")]
        [Authorize]
        public async Task<ActionResult<List<Purchase>>> GetUserPurchases()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized("User ID not found in token");

                var purchases = await _stripeService.GetUserPurchasesAsync(userId);
                return Ok(purchases);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user purchases");
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("purchase/session/{sessionId}")]
        [Authorize]
        public async Task<ActionResult<Purchase>> GetPurchaseBySession(string sessionId)
        {
            try
            {
                var purchase = await _stripeService.GetPurchaseBySessionIdAsync(sessionId);

                // Verify the purchase belongs to the current user
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (purchase.UserId != userId)
                    return Forbid();

                return Ok(purchase);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving purchase for session {SessionId}", sessionId);
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}