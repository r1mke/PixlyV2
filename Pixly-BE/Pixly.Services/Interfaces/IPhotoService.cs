using Pixly.Models.InsertRequest;
using Pixly.Models.SearchRequest;
using Pixly.Models.UpdateRequest;

namespace Pixly.Services.Interfaces
{
    public interface IPhotoService : ICRUDService<Models.DatabaseModels.Photo, PhotoSearchRequest, PhotoInsertRequest, PhotoUpdateRequest>
    {
    }
}
