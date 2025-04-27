using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using Pixly.Models.InsertRequest;
using Pixly.Models.SearchRequest;
using Pixly.Models.UpdateRequest;
using Pixly.Services.Database;
using Pixly.Services.Helper;
using Pixly.Services.Interfaces;
namespace Pixly.Services.Services

{
    public class PhotoService : CRUDService<Models.DatabaseModels.Photo, PhotoSearchRequest, PhotoInsertRequest, PhotoUpdateRequest, Database.Photo>, IPhotoService
    {


        private readonly ICloudinaryService _cloudinary;
        public PhotoService(IMapper mapper, ApplicationDbContext context, ICloudinaryService cloudinary) : base(mapper, context)
        {
            _cloudinary = cloudinary;

        }

        protected override IQueryable<Database.Photo> AddFilter(IQueryable<Database.Photo> query, PhotoSearchRequest? search)
        {
            if (!string.IsNullOrWhiteSpace(search?.Title))
            {
                query = query.Where(x => x.Title.Contains(search.Title) ||
                                    x.PhotoTags.Any(t => t.Tag.Name.StartsWith(search.Title)));
            }

            if (!string.IsNullOrWhiteSpace(search?.Orientation))
            {
                query = query.Where(x => x.Orientation == search.Orientation);
            }

            if (!string.IsNullOrWhiteSpace(search?.Size))
            {
                switch (search.Size)
                {
                    case "Large":
                        query = query.Where(x => x.FileSize > 8 * 1024 * 1024); break;
                    case "Medium":
                        query = query.Where(x => x.FileSize >= 5 * 1024 * 1024 && x.FileSize <= 8 * 1024 * 1024); break;
                    case "Small":
                        query = query.Where(x => x.FileSize < 5 * 1024 * 1024); break;
                }
            }

            if (search.IsUserIncluded == true)
            {
                query = query.Include(p => p.User);
            }

            if (!string.IsNullOrWhiteSpace(search?.Sorting))
            {
                if (search.Sorting == "Popular")
                {
                    query = query.OrderByDescending(x => x.LikeCount + x.DownloadCount);
                }
                if (search.Sorting == "New")
                {
                    query = query.OrderByDescending(x => x.UploadedAt);
                }
            }

            return query;
        }

        protected override async Task BeforeInsert(Database.Photo entity, PhotoInsertRequest request)
        {
            var user = await _context.Users.FindAsync(request.UserId);
            if (user == null) throw new Exception("Korisnik ne postoji");
            ValidImageFormat.IsImageValid(request.File);
            entity = await _cloudinary.UploadImageAsync(request.File, "Pixly", entity);

            entity.User = user;

            foreach (var tagId in request.TagIds)
            {
                entity.PhotoTags.Add(new PhotoTag
                {
                    TagId = tagId
                });
            }
        }

        protected override async Task BeforeUpdate(PhotoUpdateRequest? request, Database.Photo? entity)
        {
            var user = await _context.Users.FindAsync(entity.UserId);
            if (user == null) throw new Exception("Korisnik ne postoji");

            if (!string.IsNullOrWhiteSpace(request.Title))
            {
                entity.Title = request.Title;
            }
            if (!string.IsNullOrWhiteSpace(request.Description))
            {
                entity.Description = request.Description;
            }
            entity.User = user;
        }


    }
}



