using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using Pixly.Models.InsertRequest;
using Pixly.Models.SearchRequest;
using Pixly.Models.UpdateRequest;
using Pixly.Services.Database;
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

        public override IQueryable<Database.Photo> AddFilter(IQueryable<Database.Photo> query, PhotoSearchRequest? search)
        {
            if (!string.IsNullOrWhiteSpace(search?.Title))
            {
                query = query.Where(x => x.Title.StartsWith(search.Title));
            }

            if (search.IsUserIncluded == true)
            {
                query = query.Include(p => p.User);
            }

            return query;
        }

        public override async Task BeforeInsert(Database.Photo entity, PhotoInsertRequest request)
        {
            var user = await _context.Users.FindAsync(request.UserId);
            if (user == null) throw new Exception("Korisnik ne postoji");
            //ValidImageFormat.IsImageValid(request.File);
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

        public override async Task BeforeUpdate(PhotoUpdateRequest? request, Database.Photo? entity)
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



