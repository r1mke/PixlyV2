using MapsterMapper;
using Pixly.Models.Pagination;
using Pixly.Services.Database;
using Pixly.Services.Exceptions;
using Pixly.Services.Helper;
using Pixly.Services.Interfaces;

namespace Pixly.Services.Services
{
    public class CRUDService<TModelDetail, TModelBasic, TSearch, TInsert, TUpdate, TDbEntity, TId> : ICRUDService<TModelDetail, TModelBasic, TSearch, TInsert, TUpdate, TId> where TDbEntity : class where TSearch : PaginationParams where TInsert : class where TUpdate : class
    {
        protected readonly ICacheService _cacheService;
        public IMapper Mapper;
        protected readonly ApplicationDbContext _context;

        public CRUDService(IMapper mapper, ApplicationDbContext context, ICacheService cacheService)
        {
            Mapper = mapper;
            _context = context;
            _cacheService = cacheService;
        }
        public virtual async Task<TModelDetail> GetById(TId id)
        {
            var entityName = typeof(TDbEntity).Name.ToLower();
            var entity = await _context.Set<TDbEntity>().FindAsync(id);
            if (entity == null) throw new NotFoundException($"Entity with ID {id} not exist");
            return Mapper.Map<TModelDetail>(entity);
        }
        public virtual async Task<PagedList<TModelBasic>> GetPaged(TSearch search)
        {
            var entityName = typeof(TDbEntity).Name.ToLower();
            var query = _context.Set<TDbEntity>().AsQueryable();
            query = await AddFilter(query, search);
            var modelQuery = query.Select(x => Mapper.Map<TModelBasic>(x));
            var result = await PagedList<TModelBasic>.CreateAsync(
                    modelQuery, search.PageNumber, search.PageSize);
            return result;

        }
        public virtual async Task<TModelBasic> Insert(TInsert request)
        {
            TDbEntity entity = Mapper.Map<TDbEntity>(request);
            await BeforeInsert(entity, request);
            await _context.AddAsync(entity);
            await _context.SaveChangesAsync();
            return Mapper.Map<TModelBasic>(entity);
        }
        public virtual async Task<TModelBasic> Update(TId id, TUpdate request)
        {
            var entityName = typeof(TDbEntity).Name.ToLower();
            var cacheKey = $"{entityName}:{id}";

            return await _cacheService.GetOrCreateAsync(cacheKey, async () =>
            {
                var entity = await _context.Set<TDbEntity>().FindAsync(id);
                await BeforeUpdate(request, entity);

                await _context.SaveChangesAsync();

                return Mapper.Map<TModelBasic>(entity);
            }, TimeSpan.FromMinutes(10));
        }
        protected virtual async Task<IQueryable<TDbEntity>> AddFilter(IQueryable<TDbEntity> query, TSearch? search)
        {
            return query;
        }
        protected virtual async Task BeforeInsert(TDbEntity entity, TInsert request)
        {

        }
        protected virtual async Task BeforeUpdate(TUpdate? request, TDbEntity? entity)
        {

        }
    }
}
