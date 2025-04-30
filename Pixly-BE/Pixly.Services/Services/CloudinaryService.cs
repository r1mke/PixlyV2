using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Pixly.Services.Exceptions;
using Pixly.Services.Interfaces;
using System.Net;

namespace Pixly.Services.Services
{
    public class CloudinaryService : ICloudinaryService
    {
        private readonly CloudinaryDotNet.Cloudinary _cloudinary;

        public CloudinaryService(CloudinaryDotNet.Cloudinary cloudinary)
        {
            _cloudinary = cloudinary;
        }

        public async Task<Database.Photo> UploadImageAsync(IFormFile file, string folder, Database.Photo entity)
        {

            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, file.OpenReadStream()),
                Folder = folder,
                UseFilename = true,
                UniqueFilename = false,
                Overwrite = false
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.StatusCode != HttpStatusCode.OK)
                throw new ExternalServiceException("Error sending image to Cloudinary");

            entity.Url = uploadResult.SecureUrl.AbsoluteUri;
            entity.Width = uploadResult.Width;
            entity.Height = uploadResult.Height;
            entity.FileSize = uploadResult.Bytes;
            entity.Format = uploadResult.Format;
            entity.Orientation = DetermineOrientation(uploadResult.Width, uploadResult.Height);

            return entity;
        }

        public async Task<string> UploadProfilePhoto(IFormFile file)
        {
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, file.OpenReadStream()),
                Folder = "profile_photos",
                UseFilename = true,
                UniqueFilename = false,
                Overwrite = true,
                Transformation = new Transformation()
                .Width(500)
                .Height(500)
                .Crop("thumb")
                .Gravity("face")
                .Quality("auto")
                .FetchFormat("auto")
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.StatusCode != HttpStatusCode.OK)
                throw new ExternalServiceException("Error sending image to Cloudinary");

            return uploadResult.SecureUrl.AbsoluteUri;
        }

        private string DetermineOrientation(int? width, int? height)
        {
            if (width == null || height == null)
                return "unknown";

            if (width > height)
                return "landscape";
            else if (width < height)
                return "portrait";
            else
                return "square";
        }
    }
}
