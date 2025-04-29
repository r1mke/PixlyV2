using Microsoft.EntityFrameworkCore;

namespace Pixly.Services.Helper
{
    public class PagedList<TModel> : List<TModel>
    {
        public PagedList(IEnumerable<TModel> items, int count, int pageNumber, int pageSize)
        {
            CurrentPage = pageNumber;
            TotalPages = (int)Math.Ceiling(count / (double)pageSize);
            PageSize = pageSize;
            TotalCount = count;
            AddRange(items);
        }

        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }

        public static async Task<PagedList<TModel>> CreateAsync(IQueryable<TModel> source, int pageNumber,
            int pageSize)
        {
            var count = await source.CountAsync();
            var items = await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
            return new PagedList<TModel>(items, count, pageNumber, pageSize);
        }
    }
}
