using System.Net;

namespace Pixly.Services.Exceptions
{
    public class BaseApiException : Exception
    {
        public HttpStatusCode StatusCode { get; }
        public List<string> Errors { get; set; } = new List<string>();

        public BaseApiException(string message, HttpStatusCode statusCode = HttpStatusCode.BadRequest)
            : base(message)
        {
            StatusCode = statusCode;
        }

        public BaseApiException(string message, List<string> errors, HttpStatusCode statusCode = HttpStatusCode.BadRequest)
            : base(message)
        {
            StatusCode = statusCode;
            Errors = errors;
        }
    }

    public class NotFoundException : BaseApiException
    {
        public NotFoundException(string message)
            : base(message, HttpStatusCode.NotFound)
        {
        }
    }

    public class BadRequestException : BaseApiException
    {
        public BadRequestException(string message)
            : base(message, HttpStatusCode.BadRequest)
        {
        }

        public BadRequestException(string message, List<string> errors)
            : base(message, errors, HttpStatusCode.BadRequest)
        {
        }
    }

    public class ForbiddenException : BaseApiException
    {
        public ForbiddenException(string message)
            : base(message, HttpStatusCode.Forbidden)
        {
        }
    }

    public class UnauthorizedException : BaseApiException
    {
        public UnauthorizedException(string message)
            : base(message, HttpStatusCode.Unauthorized)
        {
        }
    }

    public class ConflictException : BaseApiException
    {
        public ConflictException(string message)
            : base(message, HttpStatusCode.Conflict)
        {
        }
    }

    public class ExternalServiceException : BaseApiException
    {
        public ExternalServiceException(string message)
            : base(message, HttpStatusCode.ServiceUnavailable)
        {
        }
    }

    public class ValidationException : BaseApiException
    {
        public ValidationException(string message, List<string> errors)
            : base(message, errors, HttpStatusCode.BadRequest)
        {
        }
    }

}
