using MapsterMapper;
using Pixly.Models.Pagination;
using Pixly.Services.Database;
using Pixly.Services.Helper;
using Pixly.Services.Interfaces;

namespace Pixly.Services.Services
{
    public class CRUDService<TModel, TSearch, TInsert, TUpdate, TDbEntity> : ICRUDService<TModel, TSearch, TInsert, TUpdate> where TDbEntity : class where TSearch : PaginationParams where TInsert : class where TUpdate : class
    {

        public IMapper Mapper;
        protected readonly ApplicationDbContext _context;

        public CRUDService(IMapper mapper, ApplicationDbContext context)
        {
            Mapper = mapper;
            _context = context;
        }
        public async Task<TModel> GetById(int id)
        {
            var entity = await _context.Set<TDbEntity>().FindAsync(id);
            if (entity == null) return default;
            AddFilterToSingleEntity(entity);
            return Mapper.Map<TModel>(entity);
        }

        public async Task<PagedList<TModel>> GetPaged(TSearch search)
        {
            var query = _context.Set<TDbEntity>().AsQueryable();

            query = await AddFilter(query, search);

            var modelQuery = query.Select(x => Mapper.Map<TModel>(x));

            var result = await PagedList<TModel>.CreateAsync(modelQuery, search.PageNumber, search.PageSize);

            var transformatedResult = await AddTransformation(result, search);

            return transformatedResult;

        }
        public async Task<TModel> Insert(TInsert request)
        {
            TDbEntity entity = Mapper.Map<TDbEntity>(request);

            await BeforeInsert(entity, request);

            await _context.AddAsync(entity);
            await _context.SaveChangesAsync();



            return Mapper.Map<TModel>(entity);
        }

        public async Task<TModel> Update(int id, TUpdate request)
        {
            var entity = await _context.Set<TDbEntity>().FindAsync(id);
            await BeforeUpdate(request, entity);

            await _context.SaveChangesAsync();

            return Mapper.Map<TModel>(entity);

        }

        protected virtual Task<PagedList<TModel>> AddTransformation(PagedList<TModel> result, TSearch search)
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
