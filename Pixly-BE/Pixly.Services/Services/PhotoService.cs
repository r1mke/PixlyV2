using MapsterMapper;
using Pixly.Models.InsertRequest;
using Pixly.Models.SearchRequest;
using Pixly.Models.UpdateRequest;
using Pixly.Services.Database;
using Pixly.Services.Interfaces;
namespace Pixly.Services.Services
{
    public class PhotoService : CRUDService<Models.DatabaseModels.Photo, PhotoSearchRequest, PhotoInsertRequest, PhotoUpdateRequest, Database.Photo>, IPhotoService
    {
        public PhotoService(IMapper mapper, ApplicationDbContext context) : base(mapper, context)
        {
        }
    }
}
