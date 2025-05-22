using DotNetEnv;
using Microsoft.OpenApi.Models;
using Pixly.Services.Interfaces;
using Pixly.Services.Services;
using Pixly.Services.Settings;

namespace Pixly.API.Exstensions
{
    public static class InfrastructureExtensions
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, ConfigurationManager configuration)
        {
            // Configure SMTP
            services.AddSmtpServices();

            // Configure CORS
            services.AddCorsPolicy();

            // Configure Swagger
            services.AddSwaggerConfiguration();

            // Configure RabbitMQ
            services.AddMessageBrokerServices();

            return services;
        }

        private static IServiceCollection AddSmtpServices(this IServiceCollection services)
        {
            // Configure SMTP
            var smtpHost = Env.GetString("SMTP_HOST");
            var smtpPort = Env.GetInt("SMTP_PORT");
            var smtpUsername = Env.GetString("SMTP_USERNAME");
            var smtpPassword = Env.GetString("SMTP_PASSWORD");
            var smtpEnableSsl = Env.GetBool("SMTP_ENABLE_SSL");
            var smtpFromEmail = Env.GetString("SMTP_FROM_EMAIL");
            var smtpFromName = Env.GetString("SMTP_FROM_NAME") ?? "Auth App";

            services.Configure<SMTPSettings>(opts =>
            {
                opts.Host = smtpHost;
                opts.Port = smtpPort;
                opts.Username = smtpUsername;
                opts.Password = smtpPassword;
                opts.EnableSsl = smtpEnableSsl;
                opts.FromEmail = smtpFromEmail;
                opts.FromName = smtpFromName;
            });

            return services;
        }

        private static IServiceCollection AddCorsPolicy(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin",
                    builder => builder
                        .WithOrigins("http://localhost:4200", "https://localhost:4200")
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials());
            });

            return services;
        }

        private static IServiceCollection AddSwaggerConfiguration(this IServiceCollection services)
        {
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Auth API", Version = "v1" });

                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] {}
                    }
                });
            });

            return services;
        }

        private static IServiceCollection AddMessageBrokerServices(this IServiceCollection services)
        {
            try
            {
                var rabbitMqHost = Env.GetString("RABBITMQ_HOST") ?? "localhost";
                var rabbitMqUser = Env.GetString("RABBITMQ_USER") ?? "guest";
                var rabbitMqPassword = Env.GetString("RABBITMQ_PASSWORD") ?? "guest";
                var rabbitMqPort = Env.GetInt("RABBITMQ_PORT", 5672);

                // Use factory pattern for better error handling
                services.AddSingleton<IMessageBrokerService>(sp =>
                {
                    var logger = sp.GetRequiredService<ILogger<RabbitMQService>>();
                    try
                    {
                        logger.LogInformation("Attempting to create RabbitMQ service");
                        return new RabbitMQService(rabbitMqHost, rabbitMqUser, rabbitMqPassword, rabbitMqPort, logger);
                    }
                    catch (Exception ex)
                    {
                        logger.LogError(ex, "Failed to initialize RabbitMQ service, falling back to no-op implementation");
                        return new NoOpMessageBrokerService(sp.GetRequiredService<ILogger<NoOpMessageBrokerService>>());
                    }
                });

                services.AddHostedService<EmailConsumerService>();
            }
            catch (Exception ex)
            {
                var logger = LoggerFactory.Create(builder => builder.AddConsole())
                    .CreateLogger("RabbitMQServiceExtensions");
                logger.LogError(ex, "Error setting up RabbitMQ services");

                services.AddSingleton<IMessageBrokerService, NoOpMessageBrokerService>();
            }

            return services;
        }
    }
}
