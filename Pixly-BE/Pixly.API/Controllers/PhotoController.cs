using Pixly.Models.InsertRequest;
using Pixly.Models.SearchRequest;
using Pixly.Models.UpdateRequest;
using Pixly.Services.Interfaces;

namespace Pixly.API.Controllers
{

    public class PhotoController : CRUDController<Models.DatabaseModels.Photo, PhotoSearchRequest, PhotoInsertRequest, PhotoUpdateRequest>
    {
        public PhotoController(IPhotoService service) : base(service)
        {
        }
    }
}
