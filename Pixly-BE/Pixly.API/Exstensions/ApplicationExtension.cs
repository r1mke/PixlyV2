using CloudinaryDotNet;
using Mapster;
using Microsoft.Extensions.Options;
using Pixly.Services.Cloudinary;
using Pixly.Services.Interfaces;
using Pixly.Services.Services;
using Pixly.Services.StateMachines.PhotoStateMachine;

namespace Pixly.API.Exstensions
{
    public static class ApplicationExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, ConfigurationManager configuration)
        {
            // Register mapping
            services.AddMappingServices();

            // Register domain services
            services.AddDomainServices();

            // Register cloud services
            services.AddCloudinaryServices();

            // Register state machine
            services.AddPhotoStateMachine();

            return services;
        }

        private static IServiceCollection AddMappingServices(this IServiceCollection services)
        {
            services.AddMapster();
            return services;
        }

        private static IServiceCollection AddDomainServices(this IServiceCollection services)
        {
            services.AddTransient<IPhotoService, PhotoService>();
            services.AddTransient<ITagService, TagService>();
            services.AddTransient<IAuthService, AuthService>();
            services.AddTransient<IUserService, UserService>();
            return services;
        }

        private static IServiceCollection AddCloudinaryServices(this IServiceCollection services)
        {
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

        private static IServiceCollection AddPhotoStateMachine(this IServiceCollection services)
        {
            services.AddScoped<BasePhotoState>();
            services.AddScoped<InitialPhotoState>();
            services.AddScoped<DraftPhotoState>();
            services.AddScoped<PendingPhotoState>();
            services.AddScoped<ApprovedPhotoState>();
            services.AddScoped<HiddenPhotoState>();
            services.AddScoped<RejectedPhotoState>();
            services.AddScoped<ReportedPhotoState>();
            services.AddScoped<DeletedPhotoState>();

            return services;
        }
    }
}
