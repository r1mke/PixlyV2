using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using Pixly.Models.DTOs;
using Pixly.Models.InsertRequest;
using Pixly.Models.SearchRequest;
using Pixly.Models.UpdateRequest;
using Pixly.Services.Database;
using Pixly.Services.Exceptions;
using Pixly.Services.Helper;
using Pixly.Services.Interfaces;
using Pixly.Services.StateMachines.PhotoStateMachine;
using System.Text.Json;

namespace Pixly.Services.Services

{
    public class PhotoService : CRUDService<Models.DTOs.PhotoDetail, Models.DTOs.PhotoBasic, PhotoSearchRequest, PhotoInsertRequest, PhotoUpdateRequest, Database.Photo>, IPhotoService
    {

        public BasePhotoState BasePhotoState { get; set; }
        private readonly ICloudinaryService _cloudinary;
        public PhotoService(ICacheService cacheService, IMapper mapper, ApplicationDbContext context, ICloudinaryService cloudinary, BasePhotoState basePhotoState)
         : base(mapper, context, cacheService)
        {
            _cloudinary = cloudinary;
            BasePhotoState = basePhotoState;
        }

        public override async Task<Models.DTOs.PhotoDetail> GetById(int id)
        {
            var cacheKey = $"photo:{id}";

            return await _cacheService.GetOrCreateAsync(cacheKey, async () =>
            {
                var entity = await _context.Photos
                    .Include(p => p.PhotoTags)
                    .ThenInclude(pt => pt.Tag)
                    .FirstOrDefaultAsync(p => p.PhotoId == id);

                if (entity == null) throw new NotFoundException($"Photo with ID {id} not exist");

                AddFilterToSingleEntity(entity);
                return Mapper.Map<Models.DTOs.PhotoDetail>(entity);
            }, TimeSpan.FromMinutes(30));
        }

        protected override async Task<IQueryable<Photo>> AddFilter(IQueryable<Database.Photo> query, PhotoSearchRequest? search)
        {

            if (!string.IsNullOrWhiteSpace(search?.Username))
            {
                if (await _context.Users.FirstOrDefaultAsync(u => u.UserName.ToLower() == search.Username.ToLower()) == null)
                    throw new NotFoundException($"User with username {search.Username} not found");


                query = query.Where(x => x.User.UserName == search.Username);
            }

            if (search?.isLiked == true && search.Username != null)
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == search.Username);
                if (user == null)
                    throw new NotFoundException($"User with username {search.Username} not found");

                query = query.Where(p => p.Likes.Any(l => l.UserId == user.Id));
            }

            if (search?.isSaved == true && search.Username != null)
            {

                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == search.Username);
                if (user == null)
                    throw new NotFoundException($"User with username {search.Username} not found");

                query = query.Where(p => p.Favorites.Any(f => f.UserId == user.Id));
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

            query = query.Where(p => p.State == "Approved");

            return query;
        }

        // transformations
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

        public override async Task<PagedList<PhotoBasic>> GetPaged(PhotoSearchRequest search)
        {
            var cacheKey = $"photo:paged:{JsonSerializer.Serialize(search)}";

            return await _cacheService.GetOrCreateAsync(cacheKey, async () =>
            {
                var query = _context.Photos.AsQueryable();
                query = await AddFilter(query, search);
                var modelQuery = query.Select(x => Mapper.Map<PhotoBasic>(x));
                var result = await PagedList<PhotoBasic>.CreateAsync(
                    modelQuery, search.PageNumber, search.PageSize);
                return await AddTransformation(result, search);
            }, TimeSpan.FromMinutes(5));
        }

        protected Task<PagedList<Models.DTOs.PhotoBasic>> AddTransformation(PagedList<Models.DTOs.PhotoBasic> photos, PhotoSearchRequest search)
        {
            TransformEntities(photos);
            return Task.FromResult(photos);
        }
        private void TransformEntities(PagedList<Models.DTOs.PhotoBasic> list)
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

        // state machine
        public override Task<Models.DTOs.PhotoBasic> Insert(PhotoInsertRequest request)
        {
            var state = BasePhotoState.CreateState("Initial");
            return state.Insert(request);
        }
        public override async Task<Models.DTOs.PhotoBasic> Update(int id, PhotoUpdateRequest request)
        {
            var entity = await _context.Photos.FindAsync(id);
            if (entity == null) throw new NotFoundException($"Photo with ID {id} not found");
            var state = BasePhotoState.CreateState(entity.State);
            var result = await state.Update(id, request);
            return result;
        }
        public async Task<Models.DTOs.PhotoBasic> Submit(int id)
        {
            var entity = await _context.Photos.FindAsync(id);
            if (entity == null) throw new NotFoundException($"Photo with ID {id} not found");
            var state = BasePhotoState.CreateState(entity.State);
            var result = await state.Submit(id);
            return result;
        }
        public async Task<Models.DTOs.PhotoBasic> Approve(int id)
        {
            var entity = await _context.Photos.FindAsync(id);
            if (entity == null) throw new NotFoundException($"Photo with ID {id} not found");
            var state = BasePhotoState.CreateState(entity.State);
            var result = await state.Approve(id);
            return result;
        }
        public async Task<Models.DTOs.PhotoBasic> Reject(int id)
        {
            var entity = await _context.Photos.FindAsync(id);
            if (entity == null) throw new NotFoundException($"Photo with ID {id} not found");
            var state = BasePhotoState.CreateState(entity.State);
            var result = await state.Reject(id);
            return result;
        }
        public async Task<Models.DTOs.PhotoBasic> Edit(int id)
        {
            var entity = await _context.Photos.FindAsync(id);
            if (entity == null) throw new NotFoundException($"Photo with ID {id} not found");
            var state = BasePhotoState.CreateState(entity.State);
            var result = await state.Edit(id);
            return result;
        }
        public async Task<Models.DTOs.PhotoBasic> Hide(int id)
        {
            var entity = await _context.Photos.FindAsync(id);
            if (entity == null) throw new NotFoundException($"Photo with ID {id} not found");
            var state = BasePhotoState.CreateState(entity.State);
            var result = await state.Hide(id);
            return result;
        }
        public async Task<Models.DTOs.PhotoBasic> Delete(int id)
        {
            var entity = await _context.Photos.FindAsync(id);
            if (entity == null) throw new NotFoundException($"Photo with ID {id} not found");
            var state = BasePhotoState.CreateState(entity.State);
            var result = await state.Delete(id);
            return result;
        }
        public async Task<Models.DTOs.PhotoBasic> Restore(int id)
        {
            var entity = await _context.Photos.FindAsync(id);
            if (entity == null) throw new NotFoundException($"Photo with ID {id} not found");
            var state = BasePhotoState.CreateState(entity.State);
            var result = await state.Restore(id);
            return result;
        }
        public async Task<List<string>> AllowedActions(int id)
        {
            if (id <= 0)
            {
                var state = BasePhotoState.CreateState("initial");
                return await state.AllowedActions(null);
            }
            else
            {
                var entity = await GetById(id);
                if (entity == null) throw new Exception($"Entity with ID {id} not found");
                var state = BasePhotoState.CreateState(entity.State);
                return await state.AllowedActions(entity);
            }
        }

        // like
        public async Task<Models.DTOs.Like> LikePhoto(int photoId, string userId)
        {
            var entity = await _context.Photos.FindAsync(photoId);
            if (entity == null) throw new NotFoundException($"Photo with ID {photoId} not found");
            var state = BasePhotoState.CreateState(entity.State);
            var result = await state.LikePhoto(photoId, userId);
            return result;
        }
        public async Task UnlikePhoto(int photoId, string userId)
        {
            var entity = await _context.Photos.FindAsync(photoId);
            if (entity == null) throw new NotFoundException($"Photo with ID {photoId} not found");
            var state = BasePhotoState.CreateState(entity.State);
            await state.UnlikePhoto(photoId, userId);
        }

        // favorite
        public async Task<Models.DTOs.Favorite> SavePhoto(int photoId, string userId)
        {
            var entity = await _context.Photos.FindAsync(photoId);
            if (entity == null) throw new NotFoundException($"Photo with ID {photoId} not found");
            var state = BasePhotoState.CreateState(entity.State);
            var result = await state.SavePhoto(photoId, userId);
            return result;
        }
        public async Task UnsavePhoto(int photoId, string userId)
        {
            var entity = await _context.Photos.FindAsync(photoId);
            if (entity == null) throw new NotFoundException($"Photo with ID {photoId} not found");
            var state = BasePhotoState.CreateState(entity.State);
            await state.LikePhoto(photoId, userId);
        }

        public async Task<PhotoDetail> GetBySlug(string slug)
        {
            var cacheKey = $"photoSlug:{slug}";

            return await _cacheService.GetOrCreateAsync(cacheKey, async () =>
            {
                var entity = await _context.Photos.FirstOrDefaultAsync(p => p.Slug == slug);
                if (entity == null) throw new NotFoundException($"Photo with slug {slug} not found");
                return Mapper.Map<PhotoDetail>(entity);
            }, TimeSpan.FromMinutes(30));
        }
    }
}



