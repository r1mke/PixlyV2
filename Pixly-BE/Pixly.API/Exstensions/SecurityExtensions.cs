using DotNetEnv;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Pixly.Services.Database;
using Pixly.Services.Exceptions;
using Pixly.Services.Settings;
using System.Text;
using System.Text.Json;
using System.Threading.RateLimiting;
using User = Pixly.Services.Database.User;

namespace Pixly.API.Exstensions
{
    public static class SecurityExtensions
    {
        public static IServiceCollection AddSecurityServices(this IServiceCollection services, ConfigurationManager configuration)
        {
            // Identity & JWT configuration
            services.AddIdentityConfiguration();
            services.AddJwtAuthentication();

            // Rate limiting
            services.AddRateLimiting();

            return services;
        }

        private static IServiceCollection AddIdentityConfiguration(this IServiceCollection services)
        {
            services.AddIdentity<User, IdentityRole>(options =>
            {
                // Password settings
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequiredLength = 8;

                // Lockout settings
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
                options.Lockout.MaxFailedAccessAttempts = 5;

                // User settings
                options.User.RequireUniqueEmail = true;
                options.SignIn.RequireConfirmedEmail = false;

                // Token provider settings
                options.Tokens.EmailConfirmationTokenProvider = "Default";
                options.Tokens.PasswordResetTokenProvider = "Default";
                options.Tokens.AuthenticatorTokenProvider = TokenOptions.DefaultAuthenticatorProvider;
            })
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

            return services;
        }

        private static IServiceCollection AddJwtAuthentication(this IServiceCollection services)
        {
            var secret = Env.GetString("JWT_SECRET");
            var issuer = Env.GetString("JWT_ISSUER");
            var audience = Env.GetString("JWT_AUDIENCE");

            services.Configure<JWTSettings>(opts =>
            {
                opts.Secret = secret;
                opts.Issuer = issuer;
                opts.Audience = audience;
                opts.ExpirationInMinutes = 15;
                opts.RefreshTokenExpirationInDays = 7;
            });

            services.Configure<RefreshTokenSettings>(opts =>
            {
                opts.ExpirationInDays = 7;
                opts.MaxRefreshCount = 100;
                opts.MaxActiveSessionsPerUser = 5;
                opts.EnableTokenRotation = true;
                opts.DetectTokenReuse = true;
            });

            var key = Encoding.ASCII.GetBytes(secret);

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = issuer,
                    ValidAudience = audience,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };

                options.Events = new JwtBearerEvents
                {
                    OnAuthenticationFailed = context =>
                    {
                        if (context.Exception is SecurityTokenExpiredException)
                        {
                            context.Response.Headers.Add("X-Token-Expired", "true");
                        }

                        return Task.CompletedTask;
                    },
                    OnChallenge = context =>
                    {
                        /*
                        if (context.HttpContext.Items.ContainsKey("TokenRefreshed"))
                        {
                            context.HandleResponse();

                            var newToken = context.HttpContext.Items["NewToken"] as string;
                            context.HttpContext.Response.Headers.Add("X-New-Token", newToken);

                            var response = new
                            {
                                success = true,
                                message = "Token refreshed successfully",
                                data = new { isAuthenticated = true }
                            };

                            context.HttpContext.Response.StatusCode = 200;
                            context.HttpContext.Response.ContentType = "application/json";
                            var jsonResponse = System.Text.Json.JsonSerializer.Serialize(response);
                            context.HttpContext.Response.WriteAsync(jsonResponse);

                            return Task.CompletedTask;
                        }
                        */

                        context.HandleResponse();
                        throw new UnauthorizedException("You are not authorized, or token is expired.");
                    },
                    OnMessageReceived = context =>
                    {
                        var token = context.Request.Headers["Authorization"].FirstOrDefault();
                        if (!string.IsNullOrEmpty(token))
                        {
                            if (!token.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                            {
                                context.Token = token;
                            }
                        }
                        return Task.CompletedTask;
                    }
                };
            });

            return services;
        }

        private static IServiceCollection AddRateLimiting(this IServiceCollection services)
        {
            services.AddRateLimiter(options =>
            {
                options.AddPolicy("auth-email", httpContext =>
                {
                    var ipAddress = GetClientIpAddress(httpContext);

                    string email = TryGetEmailFromRequest(httpContext);

                    var key = $"{email}_{ipAddress}";

                    return RateLimitPartition.GetFixedWindowLimiter(
                        partitionKey: key,
                        factory: _ => new FixedWindowRateLimiterOptions
                        {
                            PermitLimit = 10,
                            Window = TimeSpan.FromMinutes(5),
                            AutoReplenishment = true
                        });
                });

                options.AddPolicy("ip-only", httpContext =>
                {
                    var ipAddress = GetClientIpAddress(httpContext);

                    return RateLimitPartition.GetFixedWindowLimiter(
                        partitionKey: ipAddress,
                        factory: _ => new FixedWindowRateLimiterOptions
                        {
                            PermitLimit = 20,
                            Window = TimeSpan.FromMinutes(1),
                            AutoReplenishment = true
                        });
                });

                options.AddPolicy("email-only", httpContext =>
                {
                    string email = "anonymous";
                    if (httpContext.User?.Identity?.IsAuthenticated == true)
                    {
                        email = httpContext.User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value ?? "authenticated";
                    }
                    else
                    {
                        email = TryGetEmailFromRequest(httpContext);
                    }

                    return RateLimitPartition.GetFixedWindowLimiter(
                        partitionKey: email,
                        factory: _ => new FixedWindowRateLimiterOptions
                        {
                            PermitLimit = 5,
                            Window = TimeSpan.FromMinutes(1),
                            AutoReplenishment = true
                        });
                });

                options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
                {
                    var ipAddress = GetClientIpAddress(httpContext);

                    return RateLimitPartition.GetFixedWindowLimiter(
                        partitionKey: ipAddress,
                        factory: _ => new FixedWindowRateLimiterOptions
                        {
                            PermitLimit = 1000,
                            Window = TimeSpan.FromHours(1),
                            AutoReplenishment = true
                        });
                });

                options.OnRejected = async (context, token) =>
                {
                    context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
                    context.HttpContext.Response.ContentType = "application/json";

                    var ipAddress = GetClientIpAddress(context.HttpContext);
                    string email = GetEmailFromContext(context.HttpContext);

                    TimeSpan? retryAfter = null;
                    if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var timeSpan))
                    {
                        retryAfter = timeSpan;
                    }

                    if (retryAfter.HasValue)
                    {
                        context.HttpContext.Response.Headers.RetryAfter = ((int)retryAfter.Value.TotalSeconds).ToString();
                    }

                    var response = new
                    {
                        success = false,
                        message = "Too many requests. Please try again later.",
                        details = new
                        {
                            ip = ipAddress,
                            email = email,
                            path = context.HttpContext.Request.Path.ToString(),
                            method = context.HttpContext.Request.Method,
                            retryAfter = retryAfter?.TotalSeconds ?? 60
                        }
                    };

                    var loggerFactory = context.HttpContext.RequestServices.GetRequiredService<ILoggerFactory>();
                    var logger = loggerFactory.CreateLogger("RateLimiting");

                    logger.LogWarning(
                        "Rate limit exceeded. IP: {IpAddress}, Email: {Email}, Path: {Path}, Method: {Method}, RetryAfter: {RetryAfter}",
                        ipAddress,
                        email,
                        context.HttpContext.Request.Path,
                        context.HttpContext.Request.Method,
                        retryAfter?.TotalSeconds ?? 60
                    );

                    await context.HttpContext.Response.WriteAsJsonAsync(response, token);
                };
            });

            return services;
        }

        private static string GetClientIpAddress(HttpContext context)
        {
            string ip = null;

            var forwardedFor = context.Request.Headers["X-Forwarded-For"].FirstOrDefault();
            if (!string.IsNullOrEmpty(forwardedFor))
            {
                ip = forwardedFor.Split(',')[0].Trim();
            }

            if (string.IsNullOrEmpty(ip))
            {
                ip = context.Request.Headers["X-Real-IP"].FirstOrDefault();
            }

            if (string.IsNullOrEmpty(ip) && context.Connection.RemoteIpAddress != null)
            {
                ip = context.Connection.RemoteIpAddress.ToString();
            }

            return string.IsNullOrEmpty(ip) ? "unknown" : ip;
        }

        private static string GetEmailFromContext(HttpContext context)
        {
            if (context.User?.Identity?.IsAuthenticated == true)
            {
                return context.User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value ?? "authenticated";
            }

            return TryGetEmailFromRequest(context);
        }

        private static string TryGetEmailFromRequest(HttpContext context)
        {
            string email = "unknown";

            try
            {
                if (context.Request.RouteValues.TryGetValue("email", out var emailValue) && emailValue != null)
                {
                    email = emailValue.ToString();
                }
                else if (context.Request.Query.TryGetValue("email", out var queryEmail) && queryEmail.Count > 0)
                {
                    email = queryEmail.First();
                }
                else if (context.Request.Method == "POST" &&
                        (context.Request.Path.ToString().EndsWith("/login") ||
                        context.Request.Path.ToString().EndsWith("/register")) &&
                        context.Request.ContentType != null &&
                        context.Request.ContentType.Contains("application/json"))
                {

                    context.Request.EnableBuffering();

                    var position = context.Request.Body.Position;

                    using (var reader = new StreamReader(context.Request.Body, leaveOpen: true))
                    {
                        var body = reader.ReadToEndAsync().Result;

                        try
                        {
                            var jsonDocument = JsonDocument.Parse(body);
                            if (jsonDocument.RootElement.TryGetProperty("email", out var emailElement) &&
                                emailElement.ValueKind == JsonValueKind.String)
                            {
                                email = emailElement.GetString();
                            }
                        }
                        catch (JsonException)
                        {

                        }
                    }
                    context.Request.Body.Position = position;
                }
            }
            catch
            {
            }

            return email;
        }

    }
}
