using Microsoft.AspNetCore.Mvc;
using Pixly.Models.DTOs;
using Pixly.Models.InsertRequest;
using Pixly.Models.SearchRequest;
using Pixly.Models.UpdateRequest;
using Pixly.Services.Interfaces;

namespace Pixly.API.Controllers
{
    [Route("api/tag")]
    public class TagController : CRUDController<Tag, Tag, TagSearchRequest, TagInsertRequest, TagUpdateRequest, int>
    {
        public TagController(ITagService service) : base(service)
        {
        }
    }
}
