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
    public class PhotoController : CRUDController<PhotoDetail, PhotoBasic, PhotoSearchRequest, PhotoInsertRequest, PhotoUpdateRequest, int>
    {
        public PhotoController(IPhotoService service) : base(service)
        {
        }

        [HttpGet("slug/{slug}")]
        public async Task<ActionResult<ApiResponse<PhotoDetail>>> GetBySlug(string slug)
        {
            var result = await (_service as IPhotoService).GetBySlug(slug);

            if (result == null) return this.ApiNotFound<PhotoDetail>($"Resource with slug {slug} not found");
            return this.ApiSuccess(result);
        }

        [HttpGet("search-suggestion/{title}")]
        [ResponseCache(Duration = 60)]
        public async Task<ActionResult<ApiResponse<List<string>>>> GetSearchSuggestions(string title)
        {
            if (string.IsNullOrWhiteSpace(title) || title.Length < 1)
                return this.ApiSuccess(new List<string>());

            var result = await (_service as IPhotoService).SearchSuggestions(title);

            if (result == null)
                return this.ApiSuccess(new List<string>());

            return this.ApiSuccess(result);
        }

        [HttpPost("{photoId}/like")]
        public async Task<ActionResult<ApiResponse<Like>>> LikePhoto(int photoId, string userId)
        {
            var like = await (_service as IPhotoService).LikePhoto(photoId, userId);

            if (like == null)
                return this.ApiNotFound<Like>();

            return this.ApiSuccess<Like>(like);
        }

        [HttpDelete("{photoId}/like")]
        public async Task<ActionResult<ApiResponse<object>>> UnlikePhoto(int photoId, string userId)
        {

            await (_service as IPhotoService).UnlikePhoto(photoId, userId);

            return this.ApiSuccess<object>(null);
        }

        [HttpPost("{photoId}/save")]
        public async Task<ActionResult<ApiResponse<Favorite>>> SavePhoto(int photoId, string userId)
        {
            var favorite = await (_service as IPhotoService).SavePhoto(photoId, userId);

            if (favorite == null)
                return this.ApiNotFound<Favorite>();

            return this.ApiSuccess<Favorite>(favorite);
        }

        [HttpDelete("{photoId}/save")]
        public async Task<ActionResult<ApiResponse<object>>> UnsavePhoto(int photoId, string userId)
        {
            await (_service as IPhotoService).UnsavePhoto(photoId, userId);

            return this.ApiSuccess<object>(null);
        }

        [HttpPost("{id}/submit")]
        public async Task<ActionResult<ApiResponse<PhotoBasic>>> SubmitPhoto(int id)
        {
            var result = await (_service as IPhotoService).Submit(id);
            return this.ApiSuccess(result);
        }

        [HttpPost("{id}/approve")]
        public async Task<ActionResult<ApiResponse<PhotoBasic>>> ApprovePhoto(int id)
        {
            var result = await (_service as IPhotoService).Approve(id);
            return this.ApiSuccess(result);
        }

        [HttpPost("{id}/reject")]
        public async Task<ActionResult<ApiResponse<PhotoBasic>>> RejectPhoto(int id)
        {
            var result = await (_service as IPhotoService).Reject(id);
            return this.ApiSuccess(result);
        }

        [HttpPost("{id}/edit")]
        public async Task<ActionResult<ApiResponse<PhotoBasic>>> EditPhoto(int id)
        {
            var result = await (_service as IPhotoService).Edit(id);
            return this.ApiSuccess(result);
        }

        [HttpPost("{id}/hide")]
        public async Task<ActionResult<ApiResponse<PhotoBasic>>> HidePhoto(int id)
        {
            var result = await (_service as IPhotoService).Hide(id);
            return this.ApiSuccess(result);
        }

        [HttpPost("{id}/delete")]
        public async Task<ActionResult<ApiResponse<PhotoBasic>>> DeletePhoto(int id)
        {
            var result = await (_service as IPhotoService).Delete(id);
            return this.ApiSuccess(result);
        }

        [HttpPost("{id}/restore")]
        public async Task<ActionResult<ApiResponse<PhotoBasic>>> RestorePhoto(int id)
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
