using DotNetEnv;
using Mapster;
using Microsoft.EntityFrameworkCore;
using Pixly.Services.Database;
using Pixly.Services.Interfaces;
using Pixly.Services.Services;
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

            services.AddMapster();
            services.AddTransient<IPhotoService, PhotoService>();

            return services;
        }
    }
}
