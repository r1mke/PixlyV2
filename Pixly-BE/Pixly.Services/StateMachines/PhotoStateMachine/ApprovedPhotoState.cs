using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using Pixly.Services.Database;
using Pixly.Services.Exceptions;
using Pixly.Services.Interfaces;

namespace Pixly.Services.StateMachines.PhotoStateMachine
{
    public class ApprovedPhotoState : BasePhotoState
    {
        public ApprovedPhotoState(ICacheService cacheService, IMapper mapper, IServiceProvider serviceProvider, ICloudinaryService cloudinary, ApplicationDbContext context) : base(cacheService, mapper, serviceProvider, cloudinary, context)
        {
        }

        public override async Task<Models.DTOs.PhotoBasic> Hide(int id)
        {
            var entity = await SetState(id, PhotoState.Hidden.ToString());
            await _context.SaveChangesAsync();
            return Mapper.Map<Models.DTOs.PhotoBasic>(entity);
        }

        public override async Task<Models.DTOs.PhotoBasic> Reject(int id)
        {
            var entity = await SetState(id, PhotoState.Rejected.ToString());
            await _context.SaveChangesAsync();
            return Mapper.Map<Models.DTOs.PhotoBasic>(entity);
        }

        public override async Task<Models.DTOs.PhotoBasic> Edit(int id)
        {
            var entity = await SetState(id, PhotoState.Draft.ToString());
            await _context.SaveChangesAsync();
            return Mapper.Map<Models.DTOs.PhotoBasic>(entity);
        }
        public override async Task<Models.DTOs.PhotoBasic> Delete(int id)
        {
            var entity = await SetState(id, PhotoState.Deleted.ToString());
            entity.IsDeleted = true;
            await _context.SaveChangesAsync();
            return Mapper.Map<Models.DTOs.PhotoBasic>(entity);
        }

        public override async Task<Models.DTOs.Like> LikePhoto(int photoId, string userId)
        {
            var photo = await _context.Photos.FindAsync(photoId);
            if (photo == null)
                throw new NotFoundException($"Photo with ID {photoId} not found");

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new NotFoundException($"User with ID {userId} not found");


            var existingLike = await _context.Likes
                .FirstOrDefaultAsync(l => l.PhotoId == photoId && l.UserId == user.Id);

            if (existingLike != null)
                throw new ConflictException($"User with ID {userId} alredy like photo with ID {photo.PhotoId}");

            Database.Like entity = new Database.Like
            {
                PhotoId = photoId,
                UserId = user.Id,
                LikedAt = DateTime.UtcNow
            };

            await _context.Likes.AddAsync(entity);
            photo.LikeCount++;

            await _context.SaveChangesAsync();

            await _cacheService.RemoveAsync($"photo:{photoId}");
            await _cacheService.RemoveByPrefixAsync($"getPaged:");
            return Mapper.Map<Models.DTOs.Like>(entity);
        }

        public override async Task UnlikePhoto(int photoId, string userId)
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

        public override async Task<Models.DTOs.Favorite> SavePhoto(int photoId, string userId)
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

        public override async Task UnsavePhoto(int photoId, string userId)
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
        public override Task<List<string>> AllowedActions(Models.DTOs.PhotoDetail enitity)
        {
            return Task.FromResult(new List<string>() { nameof(Hide),
                                    nameof(Edit),
                                    nameof(Delete),
                                    nameof(Reject),
                                    nameof(LikePhoto),
                                    nameof(UnlikePhoto),
                                    nameof(SavePhoto),
                                    nameof(UnsavePhoto) });
        }
    }
}
