using Pixly.Models.Pagination;

namespace Pixly.Models.SearchRequest
{
    public class TagSearchRequest : PaginationParams
    {
        public string? Name { get; set; }
    }
}
