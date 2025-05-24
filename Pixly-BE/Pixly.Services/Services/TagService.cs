using MapsterMapper;
using Pixly.Models.InsertRequest;
using Pixly.Models.SearchRequest;
using Pixly.Models.UpdateRequest;
using Pixly.Services.Database;
using Pixly.Services.Exceptions;
using Pixly.Services.Interfaces;

namespace Pixly.Services.Services
{
    public class TagService : CRUDService<Models.DTOs.Tag, Models.DTOs.Tag, TagSearchRequest, TagInsertRequest, TagUpdateRequest, Database.Tag, int>, ITagService
    {
        public TagService(IMapper mapper, ApplicationDbContext context, ICacheService cacheService) : base(mapper, context, cacheService)
        {
        }

        protected override async Task<IQueryable<Tag>> AddFilter(IQueryable<Tag> query, TagSearchRequest? search)
        {
            if (!string.IsNullOrWhiteSpace(search?.Name))
            {
                query = query.Where(x => x.Name.StartsWith(search.Name));
            }

            return query;
        }

        protected override async Task BeforeUpdate(TagUpdateRequest? request, Tag? entity)
        {
            var tag = await _context.Tags.FindAsync(entity.TagId);
            if (tag == null) throw new NotFoundException($"Tag with ID {entity.TagId} not found");

            if (!string.IsNullOrWhiteSpace(request.Name))
            {
                entity.Name = request.Name;
            }
        }
    }
}
