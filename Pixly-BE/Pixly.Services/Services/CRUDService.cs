using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using Pixly.Services.Database;
using Pixly.Services.Interfaces;

namespace Pixly.Services.Services
{
    public class CRUDService<TModel, TSearch, TInsert, TUpdate, TDbEntity> : ICRUDService<TModel, TSearch, TInsert, TUpdate> where TDbEntity : class where TSearch : class where TInsert : class where TUpdate : class
    {

        public IMapper Mapper;
        private readonly ApplicationDbContext _context;

        public CRUDService(IMapper mapper, ApplicationDbContext context)
        {
            Mapper = mapper;
            _context = context;
        }

        public async Task<List<TModel>> GetPaged(TSearch search)
        {
            List<TModel> result = new List<TModel>();

            var query = _context.Set<TDbEntity>().AsQueryable();

            query = AddFilter(query, search);

            var list = await query.ToListAsync();

            return Mapper.Map<List<TModel>>(list);
        }

        public virtual IQueryable<TDbEntity> AddFilter(IQueryable<TDbEntity> query, TSearch? search)
        {
            return query;
        }

        public async Task<TModel> GetById(int id)
        {
            var entity = await _context.Set<TDbEntity>().FindAsync(id);
            if (entity == null) return default;

            return Mapper.Map<TModel>(entity);
        }

        public async Task<TModel> Insert(TInsert request)
        {
            TDbEntity entity = Mapper.Map<TDbEntity>(request);

            //BeforeInsert(entity);

            await _context.AddAsync(entity);
            await _context.SaveChangesAsync();



            return Mapper.Map<TModel>(entity);
        }

        public virtual void BeforeInsert(TDbEntity entity)
        {

        }

        public async Task<TModel> Update(int id, TUpdate request)
        {
            var entity = await _context.Set<TDbEntity>().FindAsync(id);
            if (entity == null) return default;
            Mapper.Map(request, entity);
            BeforeUpdate(request, entity);

            await _context.SaveChangesAsync();

            return Mapper.Map<TModel>(entity);

        }

        public virtual void BeforeUpdate(TUpdate? request, TDbEntity? entity)
        {

        }
    }
}
