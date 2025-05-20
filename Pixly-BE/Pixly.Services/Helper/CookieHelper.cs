using Microsoft.AspNetCore.Http;

namespace Pixly.Services.Helper
{
    public static class CookieHelper
    {
        public static void SetRefreshTokenCookie(HttpContext context, string refreshToken)
        {
            /* Za PRODUKCIJU
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true, // Nije dostupan JavaScript-u - zaštita od XSS napada
                Expires = DateTime.UtcNow.AddDays(7), // 7 dana, identično postavci u JwtSettings
                Secure = true, // Samo preko HTTPS-a - zaštita od presretanja prometa
                SameSite = SameSiteMode.Strict, // Stroga CSRF zaštita - cookie se šalje samo na zahtjeve s istog site-a
                Path = "/api/auth" // Ograničeno samo na auth endpointe - minimizira površinu napada
            };

            context.Response.Cookies.Append("refresh_token", refreshToken, cookieOptions);
            */

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7),
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/"
            };

            context.Response.Cookies.Append("refresh_token", refreshToken, cookieOptions);
            Console.WriteLine("Cookie postavljen: refresh_token");
        }
    }
}
