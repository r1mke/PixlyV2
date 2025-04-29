using Pixly.Services.Helper;

namespace Pixly.Services.Interfaces
{
    public interface ICRUDService<TModel, TSearch, TInsert, TUpdate>
    {
        public Task<PagedList<TModel>> GetPaged(TSearch search);
        public Task<TModel> GetById(int id);
        public Task<TModel> Insert(TInsert request);
        public Task<TModel> Update(int id, TUpdate request);
    }
}
