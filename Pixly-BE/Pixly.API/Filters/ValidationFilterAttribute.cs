using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Pixly.Models.DTOs;

namespace Pixly.API.Filters
{
    public class ValidationFilterAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if (!context.ModelState.IsValid)
            {
                var errors = context.ModelState
                    .Where(e => e.Value.Errors.Count > 0)
                    .SelectMany(x => x.Value.Errors)
                    .Select(x => x.ErrorMessage)
                    .ToList();

                var errorResponse = new ApiResponse<object>
                {
                    Success = false,
                    Message = "Validation errors occurred",
                    Errors = errors,
                    StatusCode = System.Net.HttpStatusCode.BadRequest
                };

                context.Result = new BadRequestObjectResult(errorResponse);
                return;
            }

            base.OnActionExecuting(context);
        }
    }
}
