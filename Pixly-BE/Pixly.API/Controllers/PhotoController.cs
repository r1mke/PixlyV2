using Microsoft.AspNetCore.Mvc;
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

        [HttpPost("{photoId}/like")]
        public async Task<IActionResult> LikePhoto(int photoId, int userId)
        {
            var like = await (_service as IPhotoService).LikePhoto(photoId, userId);

            if (like == null)
                return BadRequest("Nije moguće lajkovati fotografiju");

            return Ok(like);
        }

        [HttpDelete("{photoId}/like")]
        public async Task<IActionResult> UnlikePhoto(int photoId, int userId)
        {

            var success = await (_service as IPhotoService).UnlikePhoto(photoId, userId);

            if (success == null)
                return BadRequest("Nije moguće ukloniti lajk");

            return Ok(new { message = "Lajk uspješno uklonjen" });
        }

    }
}
