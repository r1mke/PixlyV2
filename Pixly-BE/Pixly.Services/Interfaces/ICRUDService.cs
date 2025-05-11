using Pixly.Services.Helper;

namespace Pixly.Services.Interfaces
{
    public interface ICRUDService<TModelDetail, TModelBasic, TSearch, TInsert, TUpdate>
    {
        public Task<PagedList<TModelBasic>> GetPaged(TSearch search);
        public Task<TModelDetail> GetById(int id);
        public Task<TModelBasic> Insert(TInsert request);
        public Task<TModelBasic> Update(int id, TUpdate request);
    }
}
