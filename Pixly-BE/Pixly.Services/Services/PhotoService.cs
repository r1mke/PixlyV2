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
using Favorite = Pixly.Models.DTOs.Favorite;
using Like = Pixly.Models.DTOs.Like;

namespace Pixly.Services.Services

{
    public class PhotoService : CRUDService<PhotoDetail, PhotoBasic, PhotoSearchRequest, PhotoInsertRequest, PhotoUpdateRequest, Photo, int>, IPhotoService
    {

        public BasePhotoState BasePhotoState { get; set; }
        private readonly ICloudinaryService _cloudinary;
        public PhotoService(ICacheService cacheService, IMapper mapper, ApplicationDbContext context, ICloudinaryService cloudinary, BasePhotoState basePhotoState)
         : base(mapper, context, cacheService)
        {
            _cloudinary = cloudinary;
            BasePhotoState = basePhotoState;
        }

        public override async Task<PhotoDetail> GetById(int id)
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
                return Mapper.Map<PhotoDetail>(entity);
            }, TimeSpan.FromMinutes(30));
        }

        protected override async Task<IQueryable<Photo>> AddFilter(IQueryable<Photo> query, PhotoSearchRequest? search)
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
                if (search.Orientation == "all orientation")
                {
                    query = query;
                }
                else
                {
                    query = query.Where(x => x.Orientation == search.Orientation);
                }

            }

            if (!string.IsNullOrWhiteSpace(search?.Size))
            {
                switch (search.Size)
                {
                    case "large":
                        query = query.Where(x => x.FileSize > 8 * 1024 * 1024); break;
                    case "medium":
                        query = query.Where(x => x.FileSize >= 5 * 1024 * 1024 && x.FileSize <= 8 * 1024 * 1024); break;
                    case "small":
                        query = query.Where(x => x.FileSize < 5 * 1024 * 1024); break;
                    case "all size":
                        query = query; break;
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

            query = query.Where(p => p.State == search.State);

            return query;
        }

        // transformations
        private void AddFilterToSingleEntity(Database.Photo photo)
        {
            TransformEntity(photo, addWatermark: true);
        }

        private void TransformEntity(Database.Photo photo, bool addWatermark = true, int fontSize = 20, string gravity = "south_east")
        {
            string transformation = photo.Orientation.ToLower() switch
            {
                "portrait" => "c_fit,w_1080,h_1620,f_auto,q_auto:good",
                "square" => "c_fit,w_1200,h_1200,f_auto,q_auto:good",
                "landscape" => "c_fit,w_1620,h_1080,f_auto,q_auto:good",
                _ => "c_fit,w_1600,h_1200,f_auto,q_auto:good"
            };

            photo.Url = TransformUrl(photo.Url, transformation, addWatermark, fontSize, gravity);
        }

        public override async Task<PagedList<PhotoBasic>> GetPaged(PhotoSearchRequest search)
        {

            var query = _context.Photos.AsQueryable();
            query = await AddFilter(query, search);

            var modelQuery = query.Select(x => Mapper.Map<PhotoBasic>(x));
            var result = await PagedList<PhotoBasic>.CreateAsync(
                modelQuery, search.PageNumber, search.PageSize);

            await SetUserFlags(result, search.CurrentUserId);

            return await AddTransformation(result, search);
        }

        private async Task SetUserFlags(IEnumerable<PhotoBasic> photos, string? currentUserId)
        {
            if (string.IsNullOrEmpty(currentUserId) || !photos.Any())
                return;

            var photoSlugs = photos.Select(p => p.Slug).ToList();

            var likedSlugs = await _context.Photos
                .Where(p => photoSlugs.Contains(p.Slug) &&
                           p.Likes.Any(l => l.UserId == currentUserId))
                .Select(p => p.Slug)
                .ToListAsync();

            var savedSlugs = await _context.Photos
                .Where(p => photoSlugs.Contains(p.Slug) &&
                           p.Favorites.Any(f => f.UserId == currentUserId))
                .Select(p => p.Slug)
                .ToListAsync();

            foreach (var photo in photos)
            {
                photo.IsCurrentUserLiked = likedSlugs.Contains(photo.Slug);
                photo.IsCurrentUserSaved = savedSlugs.Contains(photo.Slug);
            }
        }

        public async Task<string> GetPreviewLink(int id)
        {
            var entity = await _context.Photos.FindAsync(id);
            if (entity == null) throw new NotFoundException($"Photo with ID {id} not found");

            // Transformation za preview: smanjena kvaliteta + watermark
            string transformation = entity.Orientation.ToLower() switch
            {
                "portrait" => "c_fit,w_1080,h_1620,f_auto,q_20,dpr_auto,fl_progressive",
                "square" => "c_fit,w_1200,h_1200,f_auto,q_20,dpr_auto,fl_progressive",
                "landscape" => "c_fit,w_1620,h_1080,f_auto,q_20,dpr_auto,fl_progressive",
                _ => "c_fit,w_1600,h_1200,f_auto,q_20,dpr_auto,fl_progressive"
            };

            var previewUrl = TransformUrl(entity.Url, transformation, addWatermark: true, 100, "center");
            return previewUrl;
        }

        public async Task<string> GetOrginalLink(int id)
        {
            var entity = await _context.Photos.FindAsync(id);
            if (entity == null) throw new NotFoundException($"Photo with ID {id} not found");

            return entity.Url;
        }

        protected Task<PagedList<PhotoBasic>> AddTransformation(PagedList<PhotoBasic> photos, PhotoSearchRequest search)
        {
            if (search.State == "Approved" && search.isAdmin == false) TransformEntities(photos);
            else TransformEntitiesToAdmin(photos);
            return Task.FromResult(photos);
        }

        private void TransformEntitiesToAdmin(PagedList<PhotoBasic> list)
        {
            foreach (var photo in list)
            {
                string transformation = photo.Orientation.ToLower() switch
                {
                    "portrait" => "c_fill,f_auto,q_80,dpr_auto,fl_progressive",
                    "square" => "c_fill,f_auto,q_80,dpr_auto,fl_progressive",
                    "landscape" => "c_fill,f_auto,q_80,dpr_auto,fl_progressive",
                    _ => "c_fill,w_250,h_250,f_auto,q_80,dpr_auto,fl_progressive"
                };

                photo.Url = TransformUrl(photo.Url, transformation, addWatermark: false);
            }
        }

        private void TransformEntities(PagedList<PhotoBasic> list)
        {
            foreach (var photo in list)
            {
                string transformation = photo.Orientation.ToLower() switch
                {
                    "portrait" => $"c_fit,w_{300},h_{450},f_auto,q_100,dpr_auto,fl_progressive",
                    "square" => $"c_fit,w_{350},h_{350},f_auto,q_100,dpr_auto,fl_progressive",
                    "landscape" => $"c_fit,w_{450},h_{300},f_auto,q_100,dpr_auto,fl_progressive",
                    _ => "c_fill,w_350,h_300,f_auto,q_100,dpr_auto,fl_progressive"
                };

                photo.Url = TransformUrl(photo.Url, transformation, addWatermark: true);
            }
        }
        private string TransformUrl(string url, string transformation, bool addWatermark = true, int fontSize = 20, string gravity = "south_east")
        {
            if (string.IsNullOrEmpty(url))
                return url;

            int uploadIndex = url.IndexOf("upload/");
            if (uploadIndex == -1) return url;

            string watermarkTransformation = "";
            if (addWatermark)
            {
                watermarkTransformation = $"l_text:Arial_{fontSize}_bold:Pixly,co_white,o_40,g_{gravity},x_20,y_20/";
            }

            return url.Substring(0, uploadIndex + 7) + transformation + "/" + watermarkTransformation + url.Substring(uploadIndex + 7);
        }

        // state machine
        public override Task<PhotoBasic> Insert(PhotoInsertRequest request)
        {
            var state = BasePhotoState.CreateState("Initial");
            return state.Insert(request);
        }
        public override async Task<PhotoBasic> Update(int id, PhotoUpdateRequest request)
        {
            var entity = await _context.Photos.FindAsync(id);
            if (entity == null) throw new NotFoundException($"Photo with ID {id} not found");
            var state = BasePhotoState.CreateState(entity.State);
            var result = await state.Update(id, request);
            return result;
        }
        public async Task<PhotoBasic> Submit(int id)
        {
            var entity = await _context.Photos.FindAsync(id);
            if (entity == null) throw new NotFoundException($"Photo with ID {id} not found");
            var state = BasePhotoState.CreateState(entity.State);
            var result = await state.Submit(id);
            return result;
        }
        public async Task<PhotoBasic> Approve(int id)
        {
            var entity = await _context.Photos.FindAsync(id);
            if (entity == null) throw new NotFoundException($"Photo with ID {id} not found");
            var state = BasePhotoState.CreateState(entity.State);
            var result = await state.Approve(id);
            return result;
        }
        public async Task<PhotoBasic> Reject(int id)
        {
            var entity = await _context.Photos.FindAsync(id);
            if (entity == null) throw new NotFoundException($"Photo with ID {id} not found");
            var state = BasePhotoState.CreateState(entity.State);
            var result = await state.Reject(id);
            return result;
        }
        public async Task<PhotoBasic> Edit(int id)
        {
            var entity = await _context.Photos.FindAsync(id);
            if (entity == null) throw new NotFoundException($"Photo with ID {id} not found");
            var state = BasePhotoState.CreateState(entity.State);
            var result = await state.Edit(id);
            return result;
        }
        public async Task<PhotoBasic> Hide(int id)
        {
            var entity = await _context.Photos.FindAsync(id);
            if (entity == null) throw new NotFoundException($"Photo with ID {id} not found");
            var state = BasePhotoState.CreateState(entity.State);
            var result = await state.Hide(id);
            return result;
        }
        public async Task<PhotoBasic> Delete(int id)
        {
            var entity = await _context.Photos.FindAsync(id);
            if (entity == null) throw new NotFoundException($"Photo with ID {id} not found");
            var state = BasePhotoState.CreateState(entity.State);
            var result = await state.Delete(id);
            return result;
        }
        public async Task<PhotoBasic> Restore(int id)
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
        public async Task<Like> LikePhoto(int photoId, string userId)
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
        public async Task<Favorite> SavePhoto(int photoId, string userId)
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
            await state.UnsavePhoto(photoId, userId);
        }

        public async Task<PhotoDetail> GetBySlug(string slug, string currentUserId)
        {
            var entity = await _context.Photos.Include(p => p.User).Include(photo => photo.PhotoTags).ThenInclude(photoTag => photoTag.Tag).FirstOrDefaultAsync(p => p.Slug == slug);
            if (entity == null) throw new NotFoundException($"Photo with slug {slug} not found");
            TransformEntity(entity, true, 100, "center");
            var dto = Mapper.Map<PhotoDetail>(entity);

            if (!string.IsNullOrEmpty(currentUserId))
            {
                dto.IsCurrentUserLiked = await _context.Likes
                    .AnyAsync(l => l.PhotoId == entity.PhotoId && l.UserId == currentUserId);

                dto.IsCurrentUserSaved = await _context.Favorites
                    .AnyAsync(f => f.PhotoId == entity.PhotoId && f.UserId == currentUserId);
            }

            return dto;
        }

        public async Task<List<string>> SearchSuggestions(string title)
        {
            if (string.IsNullOrWhiteSpace(title))
                return new List<string>();


            var cacheKey = $"search_suggestions:{title.ToLower()}";

            return await _cacheService.GetOrCreateAsync(cacheKey, async () =>
            {
                var titleResults = await _context.Photos
                    .Where(p => p.Title.StartsWith(title) && p.State == "Approved" && !p.IsDeleted)
                    .Select(p => p.Title)
                    .Take(10)
                    .ToListAsync();

                var descriptionResults = await _context.Photos
                    .Where(p => p.Description != null && p.Description.StartsWith(title)
                          && p.State == "Approved" && !p.IsDeleted)
                    .Select(p => p.Title)
                    .Take(5)
                    .ToListAsync();

                var allResults = titleResults
                    .Concat(titleResults)
                    .Concat(descriptionResults)
                    .Distinct()
                    .Take(10)
                    .ToList();


                List<string> allResultDistinct = new List<string>();

                foreach (var s in allResults)
                {
                    allResultDistinct.Add(s.ToLower());
                }

                allResults = allResultDistinct.Distinct().ToList();

                return allResults;
            }, TimeSpan.FromMinutes(5));
        }


    }
}