using MapsterMapper;
using Pixly.Services.Database;
using Pixly.Services.Interfaces;

namespace Pixly.Services.StateMachines.PhotoStateMachine
{
    public class RejectedPhotoState : BasePhotoState
    {
        public RejectedPhotoState(IMapper mapper, IServiceProvider serviceProvider, ICloudinaryService cloudinary, ApplicationDbContext context) : base(mapper, serviceProvider, cloudinary, context)
        {
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
