using Pixly.Services.Helper;

namespace Pixly.Services.Interfaces
{
    public interface ICRUDService<TModelDetail, TModelBasic, TSearch, TInsert, TUpdate, TId>
    {
        public Task<PagedList<TModelBasic>> GetPaged(TSearch search);
        public Task<TModelDetail> GetById(TId id);
        public Task<TModelBasic> Insert(TInsert request);
        public Task<TModelBasic> Update(TId id, TUpdate request);
    }
}
