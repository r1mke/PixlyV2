using Pixly.Models.InsertRequest;
using Pixly.Models.SearchRequest;
using Pixly.Models.UpdateRequest;

namespace Pixly.Services.Interfaces
{
    public interface IPhotoService : ICRUDService<Models.DatabaseModels.Photo, PhotoSearchRequest, PhotoInsertRequest, PhotoUpdateRequest>
    {
        Task<Models.DatabaseModels.Like> LikePhoto(int photoId, int userId);
        Task<string> UnlikePhoto(int photoId, int userId);
    }
}
