using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Pixly.Models.DTOs;
using Pixly.Services.Exceptions;
using System.Net;
using System.Text.Json;
namespace Pixly.Services.Middleware
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlingMiddleware> _logger;

        public ErrorHandlingMiddleware(
            RequestDelegate next,
            ILogger<ErrorHandlingMiddleware> logger)

        {
            _next = next;
            _logger = logger;

        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            _logger.LogError(exception, "An unhandled exception has occurred");

            var statusCode = HttpStatusCode.InternalServerError;
            var message = "An unexpected error occurred";
            var errors = new List<string>();

            switch (exception)
            {
                case BaseApiException baseApiException:
                    statusCode = baseApiException.StatusCode;
                    message = baseApiException.Message;
                    errors = baseApiException.Errors;
                    break;
                case ArgumentNullException argumentNullException:
                    statusCode = HttpStatusCode.BadRequest;
                    message = argumentNullException.Message;
                    break;
                case InvalidOperationException invalidOperationException:
                    statusCode = HttpStatusCode.BadRequest;
                    message = invalidOperationException.Message;
                    break;
                default:

#if DEBUG
                    message = exception.Message;
                    errors.Add(exception.StackTrace ?? "No stack trace available");
#endif
                    break;
            }

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;

            var response = new ApiResponse<object>
            {
                Success = false,
                Message = message,
                StatusCode = statusCode,
                Errors = errors
            };

            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            var json = JsonSerializer.Serialize(response, options);
            await context.Response.WriteAsync(json);
        }


    }

    public static class ErrorHandlingMiddlewareExtensions
    {
        public static IApplicationBuilder UseErrorHandling(
            this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ErrorHandlingMiddleware>();
        }
    }
}

