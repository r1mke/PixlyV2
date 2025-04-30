using Microsoft.AspNetCore.Mvc;
using Pixly.Models.DTOs;
using System.Net;

namespace Pixly.API.Exstensions
{
    public static class ControllerExtensions
    {
        public static ActionResult<ApiResponse<T>> ApiSuccess<T>(this ControllerBase controller, T data, string message = "Operation successful")
        {
            var response = ApiResponse<T>.SuccessResponse(data, message);
            return controller.Ok(response);
        }

        public static ActionResult<ApiResponse<T>> ApiError<T>(this ControllerBase controller, string message, HttpStatusCode statusCode = HttpStatusCode.BadRequest)
        {
            var response = ApiResponse<T>.ErrorResponse(message, statusCode);
            return controller.StatusCode((int)statusCode, response);
        }

        public static ActionResult<ApiResponse<T>> ApiError<T>(this ControllerBase controller, List<string> errors, string message = "Operation failed", HttpStatusCode statusCode = HttpStatusCode.BadRequest)
        {
            var response = ApiResponse<T>.ErrorResponse(errors, message, statusCode);
            return controller.StatusCode((int)statusCode, response);
        }

        public static ActionResult<ApiResponse<T>> ApiNotFound<T>(this ControllerBase controller, string message = "Resource not found")
        {
            return controller.ApiError<T>(message, HttpStatusCode.NotFound);
        }

        public static ActionResult<ApiResponse<T>> ApiBadRequest<T>(this ControllerBase controller, string message = "Invalid request")
        {
            return controller.ApiError<T>(message, HttpStatusCode.BadRequest);
        }

        public static ActionResult<ApiResponse<T>> ApiUnauthorized<T>(this ControllerBase controller, string message = "Unauthorized access")
        {
            return controller.ApiError<T>(message, HttpStatusCode.Unauthorized);
        }

        public static ActionResult<ApiResponse<T>> ApiForbidden<T>(this ControllerBase controller, string message = "Access forbidden")
        {
            return controller.ApiError<T>(message, HttpStatusCode.Forbidden);
        }
    }
}
