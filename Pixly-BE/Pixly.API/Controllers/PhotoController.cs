using Microsoft.AspNetCore.Mvc;
using Pixly.API.Exstensions;
using Pixly.Models.DTOs;
using Pixly.Models.InsertRequest;
using Pixly.Models.SearchRequest;
using Pixly.Models.UpdateRequest;
using Pixly.Services.Interfaces;

namespace Pixly.API.Controllers
{

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

    }
}
