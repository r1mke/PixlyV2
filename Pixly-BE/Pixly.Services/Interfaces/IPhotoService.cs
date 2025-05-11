using Pixly.Models.InsertRequest;
using Pixly.Models.SearchRequest;
using Pixly.Models.UpdateRequest;

namespace Pixly.Services.Interfaces
{
    public interface IPhotoService : ICRUDService<Models.DTOs.PhotoDetail, Models.DTOs.PhotoBasic, PhotoSearchRequest, PhotoInsertRequest, PhotoUpdateRequest>
    {
        Task<Models.DTOs.Like> LikePhoto(int photoId, int userId);
        Task UnlikePhoto(int photoId, int userId);
        Task<Models.DTOs.Favorite> SavePhoto(int photoId, int userId);
        Task UnsavePhoto(int photoId, int userId);
        Task<Models.DTOs.PhotoBasic> Submit(int id);
        Task<Models.DTOs.PhotoBasic> Approve(int id);
        Task<Models.DTOs.PhotoBasic> Reject(int id);
        Task<Models.DTOs.PhotoBasic> Edit(int id);
        Task<Models.DTOs.PhotoBasic> Hide(int id);
        Task<Models.DTOs.PhotoBasic> Delete(int id);
        Task<Models.DTOs.PhotoBasic> Restore(int id);
        Task<List<string>> AllowedActions(int id);
    }
}
