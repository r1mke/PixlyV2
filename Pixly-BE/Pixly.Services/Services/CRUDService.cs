using MapsterMapper;
using Pixly.Models.Pagination;
using Pixly.Services.Database;
using Pixly.Services.Exceptions;
using Pixly.Services.Helper;
using Pixly.Services.Interfaces;

namespace Pixly.Services.Services
{
    public class CRUDService<TModelDetail, TModelBasic, TSearch, TInsert, TUpdate, TDbEntity> : ICRUDService<TModelDetail, TModelBasic, TSearch, TInsert, TUpdate> where TDbEntity : class where TSearch : PaginationParams where TInsert : class where TUpdate : class
    {

        public IMapper Mapper;
        protected readonly ApplicationDbContext _context;

        public CRUDService(IMapper mapper, ApplicationDbContext context)
        {
            Mapper = mapper;
            _context = context;
        }
        public virtual async Task<TModelDetail> GetById(int id)
        {
            var entity = await _context.Set<TDbEntity>().FindAsync(id);
            if (entity == null) throw new NotFoundException($"Entity with ID {id} not exist");
            return Mapper.Map<TModelDetail>(entity);
        }
        public async Task<PagedList<TModelBasic>> GetPaged(TSearch search)
        {
            var query = _context.Set<TDbEntity>().AsQueryable();

            query = await AddFilter(query, search);

            var modelQuery = query.Select(x => Mapper.Map<TModelBasic>(x));

            var result = await PagedList<TModelBasic>.CreateAsync(modelQuery, search.PageNumber, search.PageSize);

            var transformatedResult = await AddTransformation(result, search);

            return transformatedResult;

        }
        public virtual async Task<TModelBasic> Insert(TInsert request)
        {
            TDbEntity entity = Mapper.Map<TDbEntity>(request);
            await BeforeInsert(entity, request);
            await _context.AddAsync(entity);
            await _context.SaveChangesAsync();
            return Mapper.Map<TModelBasic>(entity);
        }
        public virtual async Task<TModelBasic> Update(int id, TUpdate request)
        {
            var entity = await _context.Set<TDbEntity>().FindAsync(id);
            await BeforeUpdate(request, entity);

            await _context.SaveChangesAsync();

            return Mapper.Map<TModelBasic>(entity);

        }
        protected virtual Task<PagedList<TModelBasic>> AddTransformation(PagedList<TModelBasic> result, TSearch search)
        {
            return Task.FromResult(result);
        }
        protected virtual async Task<IQueryable<TDbEntity>> AddFilter(IQueryable<TDbEntity> query, TSearch? search)
        {
            return query;
        }
        protected virtual void AddFilterToSingleEntity(TDbEntity entity)
        {

        }
        protected virtual async Task BeforeInsert(TDbEntity entity, TInsert request)
        {

        }
        protected virtual async Task BeforeUpdate(TUpdate? request, TDbEntity? entity)
        {

        }


    }
}
