using MapsterMapper;
using Pixly.Models.InsertRequest;
using Pixly.Services.Database;
using Pixly.Services.Exceptions;
using Pixly.Services.Helper;
using Pixly.Services.Interfaces;
using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace Pixly.Services.StateMachines.PhotoStateMachine
{
    public class InitialPhotoState : BasePhotoState
    {
        public InitialPhotoState(ICacheService cacheService, IMapper mapper, IServiceProvider serviceProvider, ICloudinaryService cloudinary, ApplicationDbContext context) : base(cacheService, mapper, serviceProvider, cloudinary, context)
        {
        }

        public override async Task<Models.DTOs.PhotoBasic> Insert(PhotoInsertRequest request)
        {
            Database.Photo entity = Mapper.Map<Database.Photo>(request);

            await BeforeInsert(entity, request);
            if (request.IsDraft == true)
            {
                entity.State = PhotoState.Draft.ToString();
            }
            else
            {
                entity.State = PhotoState.Pending.ToString();
            }
            await _context.AddAsync(entity);
            await _context.SaveChangesAsync();
            return Mapper.Map<Models.DTOs.PhotoBasic>(entity);
        }
        private async Task BeforeInsert(Database.Photo entity, PhotoInsertRequest request)
        {
            var user = await _context.Users.FindAsync(request.UserId);
            if (user == null) throw new NotFoundException($"User with ID {request.UserId} not found");

            ValidImageFormat.IsImageValid(request.File);
            entity = await _cloudinary.UploadImageAsync(request.File, "Pixly", entity);

            entity.Slug = GenerateSlug(entity.Title);

            entity.User = user;

            foreach (var tagId in request.TagIds)
            {
                entity.PhotoTags.Add(new PhotoTag
                {
                    TagId = tagId
                });
            }
        }

        private string GenerateSlug(string title)
        {
            if (string.IsNullOrEmpty(title))
                title = "untitled";
            string normalizedString = title.Normalize(NormalizationForm.FormD);
            StringBuilder stringBuilder = new StringBuilder();

            foreach (char c in normalizedString)
            {
                var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
                if (unicodeCategory != UnicodeCategory.NonSpacingMark)
                {
                    stringBuilder.Append(c);
                }
            }

            string slug = stringBuilder.ToString().Normalize(NormalizationForm.FormC);

            slug = slug.ToLower()
            .Replace(" ", "-")
            .Replace("'", "")
            .Replace("\"", "")
            .Replace("&", "and")
            .Replace("@", "at")
            .Replace("#", "")
            .Replace("!", "")
            .Replace("?", "")
            .Replace("%", "")
            .Replace("*", "")
            .Replace("(", "")
            .Replace(")", "")
            .Replace(",", "")
            .Replace(".", "");

            while (slug.Contains("--"))
                slug = slug.Replace("--", "-");

            slug = Regex.Replace(slug, "[^a-z0-9-]", "");

            string[] parts = slug.Split('-', StringSplitOptions.RemoveEmptyEntries);
            if (parts.Length > 8)
            {
                slug = string.Join("-", parts.Take(5).Concat(parts.Skip(parts.Length - 3)));
            }
            else
            {
                slug = string.Join("-", parts);
            }

            if (slug.Length > 100)
                slug = slug.Substring(0, 100);
            slug = slug.Trim('-');

            int publicId = GetRandomNumber(100000, 1000000);
            slug = $"{slug}-{publicId}";

            return slug;
        }

        private static readonly Random _random = new Random();
        private static int GetRandomNumber(int minValue, int maxValue)
        {
            lock (_random)
            {
                return _random.Next(minValue, maxValue);
            }
        }

        public override Task<List<string>> AllowedActions(Models.DTOs.PhotoDetail enitity)
        {
            return Task.FromResult(new List<string>() { nameof(Insert) });
        }
    }
}
