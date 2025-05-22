namespace Pixly.Models.Response
{
    public class AuthResponse
    {
        public string UserId { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
        public DateTime Expiration { get; set; }
        public string RefreshToken { get; set; }
        public bool RequiresTwoFactor { get; set; }
        public bool EmailConfirmed { get; set; }
    }
}
