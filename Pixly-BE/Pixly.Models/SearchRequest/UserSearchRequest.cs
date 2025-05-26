using Pixly.Models.Pagination;

namespace Pixly.Models.SearchRequest
{
    public class UserSearchRequest : PaginationParams
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? UserName { get; set; }
        public string? Email { get; set; }
    }
}
