using MapsterMapper;
using Pixly.Models.InsertRequest;
using Pixly.Services.Database;
using Pixly.Services.Exceptions;
using Pixly.Services.Helper;
using Pixly.Services.Interfaces;

namespace Pixly.Services.StateMachines.PhotoStateMachine
{
    public class InitialPhotoState : BasePhotoState
    {
        public InitialPhotoState(ICacheService cacheService, IMapper mapper, IServiceProvider serviceProvider, ICloudinaryService cloudinary, ApplicationDbContext context) : base(cacheService, mapper, serviceProvider, cloudinary, context)
        {
        }

        public override async Task<Models.DTOs.PhotoBasic> Insert(PhotoInsertRequest request)
        {
            Database.Photo entity = Mapper.Map<Database.Photo>(request);

            await BeforeInsert(entity, request);
            if (request.IsDraft == true)
            {
                entity.State = PhotoState.Draft.ToString();
            }
            else
            {
                entity.State = PhotoState.Pending.ToString();
            }
            await _context.AddAsync(entity);
            await _context.SaveChangesAsync();
            return Mapper.Map<Models.DTOs.PhotoBasic>(entity);
        }
        private async Task BeforeInsert(Database.Photo entity, PhotoInsertRequest request)
        {
            var user = await _context.Users.FindAsync(request.UserId);
            if (user == null) throw new NotFoundException($"User with ID {request.UserId} not found");

            ValidImageFormat.IsImageValid(request.File);
            entity = await _cloudinary.UploadImageAsync(request.File, "Pixly", entity);

            entity.User = user;

            foreach (var tagId in request.TagIds)
            {
                entity.PhotoTags.Add(new PhotoTag
                {
                    TagId = tagId
                });
            }
        }
        public override Task<List<string>> AllowedActions(Models.DTOs.PhotoDetail enitity)
        {
            return Task.FromResult(new List<string>() { nameof(Insert) });
        }
    }
}
