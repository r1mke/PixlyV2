using Pixly.Models.InsertRequest;
using Pixly.Models.SearchRequest;
using Pixly.Models.UpdateRequest;

namespace Pixly.Services.Interfaces
{
    public interface IPhotoService : ICRUDService<Models.DTOs.Photo, PhotoSearchRequest, PhotoInsertRequest, PhotoUpdateRequest>
    {
        Task<Models.DTOs.Like> LikePhoto(int photoId, int userId);
        Task UnlikePhoto(int photoId, int userId);
        Task<Models.DTOs.Favorite> SavePhoto(int photoId, int userId);
        Task UnsavePhoto(int photoId, int userId);
        Task<Models.DTOs.Photo> Submit(int id);
        Task<Models.DTOs.Photo> Approve(int id);
        Task<Models.DTOs.Photo> Reject(int id);
        Task<Models.DTOs.Photo> Edit(int id);
        Task<Models.DTOs.Photo> Hide(int id);
        Task<Models.DTOs.Photo> Delete(int id);
        Task<Models.DTOs.Photo> Restore(int id);
        Task<List<string>> AllowedActions(Database.Photo enitity);
    }
}
