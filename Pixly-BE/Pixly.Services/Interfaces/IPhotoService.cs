using Pixly.Models.DTOs;
using Pixly.Models.InsertRequest;
using Pixly.Models.SearchRequest;
using Pixly.Models.UpdateRequest;

namespace Pixly.Services.Interfaces
{
    public interface IPhotoService : ICRUDService<PhotoDetail, PhotoBasic, PhotoSearchRequest, PhotoInsertRequest, PhotoUpdateRequest, int>
    {
        Task<List<string>> SearchSuggestions(string title);
        Task<string> GetPreviewLink(int id);
        Task<string> GetOrginalLink(int id);
        Task<Models.DTOs.Like> LikePhoto(int photoId, string userId);
        Task<Models.DTOs.PhotoDetail> GetBySlug(string slug, string currentUserId);
        Task UnlikePhoto(int photoId, string userId);
        Task<Models.DTOs.Favorite> SavePhoto(int photoId, string userId);
        Task UnsavePhoto(int photoId, string userId);
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
