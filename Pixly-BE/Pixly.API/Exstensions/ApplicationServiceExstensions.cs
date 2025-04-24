using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using Pixly.Services.Database;
namespace Pixly.API.Exstensions
{
    public static class ApplicationServiceExstensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            var connectionString = Env.GetString("DB_CONNECTION_STRING");
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(connectionString)
            );



            return services;
        }
    }
}
