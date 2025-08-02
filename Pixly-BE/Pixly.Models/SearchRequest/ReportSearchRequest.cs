using Pixly.Models.Pagination;

namespace Pixly.Models.SearchRequest
{
    public class ReportSearchRequest : PaginationParams
    {
        public string? ReportTitle { get; set; }
        public bool IsUserIncluded { get; set; } = true;
        public bool IsPhotoIncluded { get; set; } = true;
    }
}
