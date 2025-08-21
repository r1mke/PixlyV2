using Pixly.Models.Pagination;

namespace Pixly.Models.SearchRequest
{
    public class UserSearchRequest : PaginationParams
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public bool? IsActive { get; set; }
        public bool? EmailConfirmed { get; set; }
        public string? State { get; set; }

    }
}
