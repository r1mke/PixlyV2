using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using Pixly.Models.InsertRequest;
using Pixly.Models.SearchRequest;
using Pixly.Models.UpdateRequest;
using Pixly.Services.Database;
using Pixly.Services.Exceptions;
using Pixly.Services.Helper;
using Pixly.Services.Interfaces;
namespace Pixly.Services.Services

{
    public class PhotoService : CRUDService<Models.DTOs.Photo, PhotoSearchRequest, PhotoInsertRequest, PhotoUpdateRequest, Database.Photo>, IPhotoService
    {


        private readonly ICloudinaryService _cloudinary;
        public PhotoService(IMapper mapper, ApplicationDbContext context, ICloudinaryService cloudinary) : base(mapper, context)
        {
            _cloudinary = cloudinary;

        }


        protected override void AddFilterToSingleEntity(Database.Photo photo)
        {
            TransformEntity(photo);
        }

        private void TransformEntity(Database.Photo photo)
        {
            string transformation = photo.Url.ToLower() switch
            {
                "portrait" => "c_fit,w_1080,h_1620,f_auto,q_auto:good",
                "square" => "c_fit,w_1200,h_1200,f_auto,q_auto:good",
                "landscape" => "c_fit,w_1620,h_1080,f_auto,q_auto:good",
                _ => "c_fit,w_1600,h_1200,f_auto,q_auto:good"
            };

            photo.Url = TransformUrl(photo.Url, transformation);

        }

        protected override async Task<IQueryable<Photo>> AddFilter(IQueryable<Database.Photo> query, PhotoSearchRequest? search)
        {

            if (!string.IsNullOrWhiteSpace(search?.Username))
            {
                if (await _context.Users.FirstOrDefaultAsync(u => u.Username.ToLower() == search.Username.ToLower()) == null)
                    throw new NotFoundException($"User with username {search.Username} not found");


                query = query.Where(x => x.User.Username == search.Username);
            }


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

        protected override Task<PagedList<Models.DTOs.Photo>> AddTransformation(PagedList<Models.DTOs.Photo> photos, PhotoSearchRequest search)
        {
            TransformEntities(photos);

            return Task.FromResult(photos);

        }

        private void TransformEntities(PagedList<Models.DTOs.Photo> list)
        {
            foreach (var photo in list)
            {
                string transformation = photo.Orientation.ToLower() switch
                {
                    "portrait" => $"c_fit,w_{300},h_{450},f_auto,q_auto",
                    "square" => $"c_fit,w_{350},h_{350},f_auto,q_auto",
                    "landscape" => $"c_fit,w_{450},h_{300},f_auto,q_auto",
                    _ => "c_fill,w_350,h_300,f_auto,q_auto"
                };

                photo.Url = TransformUrl(photo.Url, transformation);
            }
        }

        private string TransformUrl(string url, string transformation)
        {
            if (string.IsNullOrEmpty(url))
                return url;

            int uploadIndex = url.IndexOf("upload/");
            if (uploadIndex == -1) return url;

            return url.Substring(0, uploadIndex + 7) + transformation + "/" + url.Substring(uploadIndex + 7);
        }

        protected override async Task BeforeInsert(Database.Photo entity, PhotoInsertRequest request)
        {
            var user = await _context.Users.FindAsync(request.UserId);
            if (user == null) throw new NotFoundException($"User with ID {request.UserId} not found");

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
            if (user == null) throw new NotFoundException($"User with ID {entity.UserId} not found");

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

        public async Task<Models.DTOs.Like> LikePhoto(int photoId, int userId)
        {
            var photo = await _context.Photos.FindAsync(photoId);
            if (photo == null)
                throw new NotFoundException($"Photo with ID {photoId} not found");

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new NotFoundException($"User with ID {userId} not found");


            var existingLike = await _context.Likes
                .FirstOrDefaultAsync(l => l.PhotoId == photoId && l.UserId == userId);

            if (existingLike != null)
                throw new ConflictException($"User with ID {userId} alredy like photo with ID {photo.PhotoId}");

            Database.Like entity = new Database.Like
            {
                PhotoId = photoId,
                UserId = userId,
                LikedAt = DateTime.UtcNow
            };

            await _context.Likes.AddAsync(entity);
            photo.LikeCount++;

            await _context.SaveChangesAsync();

            return Mapper.Map<Models.DTOs.Like>(entity);
        }

        public async Task UnlikePhoto(int photoId, int userId)
        {
            var photo = await _context.Photos.FindAsync(photoId);
            if (photo == null)
                throw new NotFoundException($"Photo with ID {photoId} not found");

            var like = await _context.Likes
                .FirstOrDefaultAsync(l => l.PhotoId == photoId && l.UserId == userId);

            _context.Likes.Remove(like);

            if (photo.LikeCount > 0)
                photo.LikeCount--;

            await _context.SaveChangesAsync();

        }

        public async Task<Models.DTOs.Favorite> SavePhoto(int photoId, int userId)
        {
            var photo = await _context.Photos.FindAsync(photoId);
            if (photo == null)
                throw new NotFoundException($"Photo with ID {photoId} not found");

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new NotFoundException($"User with ID {userId} not found");

            var existingFavorite = await _context.Favorites
                .FirstOrDefaultAsync(f => f.PhotoId == photoId && f.UserId == userId);

            if (existingFavorite != null)
                throw new ConflictException($"User with ID {userId} alredy save photo with ID {photo.PhotoId}");

            Database.Favorite entity = new Database.Favorite
            {
                PhotoId = photoId,
                UserId = userId,
                FavoritedAt = DateTime.UtcNow
            };

            await _context.Favorites.AddAsync(entity);

            await _context.SaveChangesAsync();

            return Mapper.Map<Models.DTOs.Favorite>(entity);
        }

        public async Task UnsavePhoto(int photoId, int userId)
        {
            var photo = await _context.Photos.FindAsync(photoId);
            if (photo == null)
                throw new NotFoundException($"Photo with ID {photoId} not found");

            var favorite = await _context.Favorites
                .FirstOrDefaultAsync(f => f.PhotoId == photoId && f.UserId == userId);

            if (favorite == null)
                throw new NotFoundException($"Favorite not found");

            _context.Favorites.Remove(favorite);

            await _context.SaveChangesAsync();
        }
    }
}



