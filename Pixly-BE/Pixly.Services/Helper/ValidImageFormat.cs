using Microsoft.AspNetCore.Http;

namespace Pixly.Services.Helper
{
    public static class ValidImageFormat
    {
        public static void IsImageValid(IFormFile file)
        {
            if (file != null)
            {
                var allowedMimeTypes = new List<string> { "image/jpeg", "image/png" };

                if (!allowedMimeTypes.Contains(file.ContentType.ToLower()))
                    throw new Exception("Allowed formats are: JPEG and PNG");

                if (file.Length < 1 * 1024 * 1024)
                    throw new Exception("The minimum allowed image size is 4MB.");

            }
            else
            {
                throw new Exception("Image is required");
            }
        }
    }
}

