namespace Pixly.Services.Interfaces
{
    public interface ICacheService
    {
        Task<T> GetOrCreateAsync<T>(string key, Func<Task<T>> factory, TimeSpan? expiration = null);
        Task RemoveAsync(string key);
        Task RemoveByPrefixAsync(string prefix);
    }
}
