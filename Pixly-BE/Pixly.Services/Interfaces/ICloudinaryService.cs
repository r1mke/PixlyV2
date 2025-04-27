using Microsoft.AspNetCore.Http;

namespace Pixly.Services.Interfaces
{
    public interface ICloudinaryService
    {
        Task<Database.Photo> UploadImageAsync(IFormFile file, string folder, Database.Photo entity);
        string UploadProfilePhoto(IFormFile file);
    }
}
