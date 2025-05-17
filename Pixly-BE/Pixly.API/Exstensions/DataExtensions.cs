using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using Pixly.Services.Database;
using Pixly.Services.Interfaces;
using Pixly.Services.Services;

namespace Pixly.API.Exstensions
{
    public static class DataExtensions
    {
        public static IServiceCollection AddDataServices(this IServiceCollection services, ConfigurationManager configuration)
        {
            // Database configuration
            var connectionString = Env.GetString("DB_CONNECTION_STRING");
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(connectionString));

            // Cache configuration
            services.AddMemoryCache();
            services.AddSingleton<ICacheService, MemoryCacheService>();

            return services;
        }
    }
}
