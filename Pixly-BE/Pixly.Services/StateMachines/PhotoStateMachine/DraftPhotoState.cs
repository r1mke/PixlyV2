using MapsterMapper;
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

        public override async Task<Models.DTOs.Photo> Submit(int id)
        {
            var entity = await SetState(id, PhotoState.Pending.ToString());
            await _context.SaveChangesAsync();
            return Mapper.Map<Models.DTOs.Photo>(entity);
        }
        public override async Task<Models.DTOs.Photo> Update(int id, PhotoUpdateRequest request)
        {
            var entity = await _context.Photos.FindAsync(id);
            await BeforeUpdate(request, entity);

            await _context.SaveChangesAsync();

            return Mapper.Map<Models.DTOs.Photo>(entity);
        }
        private async Task BeforeUpdate(PhotoUpdateRequest request, Database.Photo entity)
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
        public override async Task<Models.DTOs.Photo> Delete(int id)
        {
            var entity = await SetState(id, PhotoState.Deleted.ToString());
            entity.IsDeleted = true;
            await _context.SaveChangesAsync();
            return Mapper.Map<Models.DTOs.Photo>(entity);
        }
    }
}
