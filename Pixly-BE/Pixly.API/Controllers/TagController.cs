using Microsoft.AspNetCore.Mvc;
using Pixly.Models.InsertRequest;
using Pixly.Models.SearchRequest;
using Pixly.Models.UpdateRequest;
using Pixly.Services.Interfaces;

namespace Pixly.API.Controllers
{
    [Route("api/tag")]
    public class TagController : CRUDController<Models.DTOs.Tag, TagSearchRequest, TagInsertRequest, TagUpdateRequest>
    {
        public TagController(ITagService service) : base(service)
        {
        }
    }
}
