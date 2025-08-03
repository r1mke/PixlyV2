using Pixly.Models.Pagination;

namespace Pixly.Models.SearchRequest
{
    public class ReportSearchRequest : PaginationParams
    {
        public string? ReportTitle { get; set; }
        public bool IsReportedUserIncluded { get; set; } = true;
        public bool IsReportedByUserIncluded { get; set; } = true;
        public bool IsReportTypeIncluded { get; set; } = true;
        public bool IsPhotoIncluded { get; set; } = true;
    }
}
