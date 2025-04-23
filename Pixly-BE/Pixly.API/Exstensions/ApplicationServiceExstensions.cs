using Microsoft.EntityFrameworkCore;
using Pixly.Models.Database;

namespace Pixly.API.Exstensions
{
    public static class ApplicationServiceExstensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(config["DB_CONNECTION_STRING"])
            );

            

            return services;
        }
    }
}
