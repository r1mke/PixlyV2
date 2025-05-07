using MapsterMapper;
using Pixly.Services.Database;
using Pixly.Services.Interfaces;

namespace Pixly.Services.StateMachines.PhotoStateMachine
{
    public class HiddenPhotoState : BasePhotoState
    {
        public HiddenPhotoState(IMapper mapper, IServiceProvider serviceProvider, ICloudinaryService cloudinary, ApplicationDbContext context) : base(mapper, serviceProvider, cloudinary, context)
        {
        }

        public override async Task<Models.DTOs.Photo> Restore(int id)
        {
            var entity = await SetState(id, PhotoState.Approved.ToString());
            await _context.SaveChangesAsync();
            return Mapper.Map<Models.DTOs.Photo>(entity);
        }
        public override async Task<Models.DTOs.Photo> Delete(int id)
        {
            var entity = await SetState(id, PhotoState.Deleted.ToString());
            entity.IsDeleted = true;
            await _context.SaveChangesAsync();
            return Mapper.Map<Models.DTOs.Photo>(entity);
        }
        public override async Task<Models.DTOs.Photo> Edit(int id)
        {
            var entity = await SetState(id, PhotoState.Draft.ToString());
            await _context.SaveChangesAsync();
            return Mapper.Map<Models.DTOs.Photo>(entity);
        }

    }
}
