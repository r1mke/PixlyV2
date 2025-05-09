using Pixly.Models.InsertRequest;
using Pixly.Models.SearchRequest;
using Pixly.Models.UpdateRequest;

namespace Pixly.Services.Interfaces
{
    public interface ITagService : ICRUDService<Models.DTOs.Tag, TagSearchRequest, TagInsertRequest, TagUpdateRequest>
    {
    }
}
