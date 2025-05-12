using MapsterMapper;
using Pixly.Services.Database;
using Pixly.Services.Interfaces;

namespace Pixly.Services.StateMachines.PhotoStateMachine
{
    public class HiddenPhotoState : BasePhotoState
    {
        public HiddenPhotoState(ICacheService cacheService, IMapper mapper, IServiceProvider serviceProvider, ICloudinaryService cloudinary, ApplicationDbContext context) : base(cacheService, mapper, serviceProvider, cloudinary, context)
        {
        }

        public override async Task<Models.DTOs.PhotoBasic> Restore(int id)
        {
            var entity = await SetState(id, PhotoState.Approved.ToString());
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
        public override async Task<Models.DTOs.PhotoBasic> Edit(int id)
        {
            var entity = await SetState(id, PhotoState.Draft.ToString());
            await _context.SaveChangesAsync();
            return Mapper.Map<Models.DTOs.PhotoBasic>(entity);
        }
        public override Task<List<string>> AllowedActions(Models.DTOs.PhotoDetail enitity)
        {
            return Task.FromResult(new List<string>() { nameof(Restore), nameof(Edit), nameof(Delete) });
        }

    }
}
