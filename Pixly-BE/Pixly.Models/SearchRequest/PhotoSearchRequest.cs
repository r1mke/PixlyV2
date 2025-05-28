using Pixly.Models.Pagination;
namespace Pixly.Models.SearchRequest
{
    public class PhotoSearchRequest : PaginationParams
    {
        public string? Username { get; set; }
        public string? Title { get; set; }
        public string? Orientation { get; set; }
        public string? Size { get; set; }
        public bool? IsUserIncluded { get; set; }
        public string? Sorting { get; set; }
        public bool? isLiked { get; set; }
        public bool? isSaved { get; set; }
        public string? CurrentUserId { get; set; }
    }
}
