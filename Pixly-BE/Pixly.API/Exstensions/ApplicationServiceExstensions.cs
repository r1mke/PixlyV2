using CloudinaryDotNet;
using DotNetEnv;
using Mapster;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Pixly.Services.Cloudinary;
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

            services.Configure<CloudinarySettings>(options =>
            {
                options.CloudName = Environment.GetEnvironmentVariable("CLOUDINARY_CLOUDNAME");
                options.ApiKey = Environment.GetEnvironmentVariable("CLOUDINARY_APIKEY");
                options.ApiSecret = Environment.GetEnvironmentVariable("CLOUDINARY_APISECRET");
            });

            services.AddSingleton<Cloudinary>(serviceProvider =>
            {
                var cloudinarySettings = serviceProvider.GetRequiredService<IOptions<CloudinarySettings>>().Value;
                var account = new Account(cloudinarySettings.CloudName, cloudinarySettings.ApiKey, cloudinarySettings.ApiSecret);
                return new Cloudinary(account);
            });

            services.AddScoped<ICloudinaryService, CloudinaryService>();

            return services;
        }
    }
}
