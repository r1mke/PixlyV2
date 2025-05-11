using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using Pixly.Models.UpdateRequest;
using Pixly.Services.Database;
using Pixly.Services.Exceptions;
using Pixly.Services.Interfaces;

namespace Pixly.Services.StateMachines.PhotoStateMachine
{
    public class DraftPhotoState : BasePhotoState
    {
        public DraftPhotoState(IMapper mapper, IServiceProvider serviceProvider, ICloudinaryService cloudinary, ApplicationDbContext context) : base(mapper, serviceProvider, cloudinary, context)
        {
        }

        public override async Task<Models.DTOs.PhotoBasic> Submit(int id)
        {
            var entity = await SetState(id, PhotoState.Pending.ToString());
            await _context.SaveChangesAsync();
            return Mapper.Map<Models.DTOs.PhotoBasic>(entity);
        }
        public override async Task<Models.DTOs.PhotoBasic> Update(int id, PhotoUpdateRequest request)
        {
            var entity = await _context.Photos.FindAsync(id);
            await BeforeUpdate(request, entity);

            await _context.SaveChangesAsync();

            return Mapper.Map<Models.DTOs.PhotoBasic>(entity);
        }
        private async Task BeforeUpdate(PhotoUpdateRequest request, Database.Photo entity)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
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

                if (request.TagIds != null && request.TagIds.Count > 0)
                {

                    var existingTags = await _context.PhotoTags
                        .Where(pt => pt.PhotoId == entity.PhotoId)
                        .ToListAsync();

                    _context.PhotoTags.RemoveRange(existingTags);


                    foreach (var tagId in request.TagIds)
                    {

                        var tagExists = await _context.Tags.AnyAsync(t => t.TagId == tagId);
                        if (!tagExists)
                            throw new NotFoundException($"Tag with ID {tagId} not found");

                        entity.PhotoTags.Add(new PhotoTag
                        {
                            TagId = tagId,
                            PhotoId = entity.PhotoId
                        });
                    }
                }
                else
                {
                    throw new ValidationException("At least one tag must be selected",
                        new List<string> { "At least one tag must be selected." });
                }

                entity.User = user;

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

            }
            catch
            {
                await transaction.RollbackAsync();
                throw new ForbiddenException("Error accessing database");
            }
        }
        public override async Task<Models.DTOs.PhotoBasic> Delete(int id)
        {
            var entity = await SetState(id, PhotoState.Deleted.ToString());
            entity.IsDeleted = true;
            await _context.SaveChangesAsync();
            return Mapper.Map<Models.DTOs.PhotoBasic>(entity);
        }
        public override Task<List<string>> AllowedActions(Models.DTOs.PhotoDetail enitity)
        {
            return Task.FromResult(new List<string>() { nameof(Submit), nameof(Update), nameof(Delete) });
        }
    }
}
