using MapsterMapper;
using Pixly.Services.Database;
using Pixly.Services.Interfaces;

namespace Pixly.Services.StateMachines.PhotoStateMachine
{
    public class DeletedPhotoState : BasePhotoState
    {
        public DeletedPhotoState(IMapper mapper, IServiceProvider serviceProvider, ICloudinaryService cloudinary, ApplicationDbContext context) : base(mapper, serviceProvider, cloudinary, context)
        {
        }
        public override Task<List<string>> AllowedActions(Models.DTOs.Photo enitity)
        {
            return Task.FromResult(new List<string>() { });
        }
    }
}
