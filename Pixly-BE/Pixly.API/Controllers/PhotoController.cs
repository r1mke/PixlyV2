using Microsoft.AspNetCore.Mvc;
using Pixly.API.Exstensions;
using Pixly.Models.DTOs;
using Pixly.Models.InsertRequest;
using Pixly.Models.SearchRequest;
using Pixly.Models.UpdateRequest;
using Pixly.Services.Interfaces;

namespace Pixly.API.Controllers
{
    [Route("api/photo")]
    public class PhotoController : CRUDController<Models.DTOs.Photo, PhotoSearchRequest, PhotoInsertRequest, PhotoUpdateRequest>
    {
        public PhotoController(IPhotoService service) : base(service)
        {
        }

        [HttpPost("{photoId}/like")]
        public async Task<ActionResult<ApiResponse<Models.DTOs.Like>>> LikePhoto(int photoId, int userId)
        {
            var like = await (_service as IPhotoService).LikePhoto(photoId, userId);

            if (like == null)
                return this.ApiNotFound<Models.DTOs.Like>();

            return this.ApiSuccess<Models.DTOs.Like>(like);
        }

        [HttpDelete("{photoId}/like")]
        public async Task<ActionResult<ApiResponse<object>>> UnlikePhoto(int photoId, int userId)
        {

            await (_service as IPhotoService).UnlikePhoto(photoId, userId);

            return this.ApiSuccess<object>(null);
        }

        [HttpPost("{photoId}/save")]
        public async Task<ActionResult<ApiResponse<Models.DTOs.Favorite>>> SavePhoto(int photoId, int userId)
        {
            var favorite = await (_service as IPhotoService).SavePhoto(photoId, userId);

            if (favorite == null)
                return this.ApiNotFound<Models.DTOs.Favorite>();

            return this.ApiSuccess<Models.DTOs.Favorite>(favorite);
        }

        [HttpDelete("{photoId}/save")]
        public async Task<ActionResult<ApiResponse<object>>> UnsavePhoto(int photoId, int userId)
        {
            await (_service as IPhotoService).UnsavePhoto(photoId, userId);

            return this.ApiSuccess<object>(null);
        }

        [HttpPost("{id}/submit")]
        public async Task<ActionResult<ApiResponse<Models.DTOs.Photo>>> SubmitPhoto(int id)
        {
            var result = await (_service as IPhotoService).Submit(id);
            return this.ApiSuccess(result);
        }

        [HttpPost("{id}/approve")]
        public async Task<ActionResult<ApiResponse<Models.DTOs.Photo>>> ApprovePhoto(int id)
        {
            var result = await (_service as IPhotoService).Approve(id);
            return this.ApiSuccess(result);
        }

        [HttpPost("{id}/reject")]
        public async Task<ActionResult<ApiResponse<Models.DTOs.Photo>>> RejectPhoto(int id)
        {
            var result = await (_service as IPhotoService).Reject(id);
            return this.ApiSuccess(result);
        }

        [HttpPost("{id}/edit")]
        public async Task<ActionResult<ApiResponse<Models.DTOs.Photo>>> EditPhoto(int id)
        {
            var result = await (_service as IPhotoService).Edit(id);
            return this.ApiSuccess(result);
        }

        [HttpPost("{id}/hide")]
        public async Task<ActionResult<ApiResponse<Models.DTOs.Photo>>> HidePhoto(int id)
        {
            var result = await (_service as IPhotoService).Hide(id);
            return this.ApiSuccess(result);
        }

        [HttpPost("{id}/delete")]
        public async Task<ActionResult<ApiResponse<Models.DTOs.Photo>>> DeletePhoto(int id)
        {
            var result = await (_service as IPhotoService).Delete(id);
            return this.ApiSuccess(result);
        }

        [HttpPost("{id}/restore")]
        public async Task<ActionResult<ApiResponse<Models.DTOs.Photo>>> RestorePhoto(int id)
        {
            var result = await (_service as IPhotoService).Restore(id);
            return this.ApiSuccess(result);
        }

        [HttpGet("{id}/allowed-actions")]
        public async Task<ActionResult<ApiResponse<List<string>>>> GetAllowedActions(int id)
        {
            var actions = await (_service as IPhotoService).AllowedActions(id);
            return this.ApiSuccess(actions);
        }


    }
}
