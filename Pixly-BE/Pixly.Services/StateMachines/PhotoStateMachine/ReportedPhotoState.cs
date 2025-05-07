using MapsterMapper;
using Pixly.Services.Database;
using Pixly.Services.Interfaces;

namespace Pixly.Services.StateMachines.PhotoStateMachine
{
    public class ReportedPhotoState : BasePhotoState
    {
        public ReportedPhotoState(IMapper mapper, IServiceProvider serviceProvider, ICloudinaryService cloudinary, ApplicationDbContext context) : base(mapper, serviceProvider, cloudinary, context)
        {
        }

        public override async Task<Models.DTOs.Photo> Approve(int id)
        {
            var entity = await SetState(id, PhotoState.Approved.ToString());
            await _context.SaveChangesAsync();
            return Mapper.Map<Models.DTOs.Photo>(entity);
        }
        public override async Task<Models.DTOs.Photo> Reject(int id)
        {
            var entity = await SetState(id, PhotoState.Rejected.ToString());
            await _context.SaveChangesAsync();
            return Mapper.Map<Models.DTOs.Photo>(entity);
        }
    }
}
