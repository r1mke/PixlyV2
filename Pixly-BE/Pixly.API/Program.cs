using DotNetEnv;
using Pixly.API.Exstensions;
using Pixly.API.Filters;
using Pixly.Services.Middleware;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.


Env.Load();

builder.Services.AddControllers(options =>
{
    options.Filters.Add<ValidationFilterAttribute>();
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddCors(options =>
{
    options.AddPolicy("MyAllowSpecificOrigins",
                     policy =>
                     {
                         policy.WithOrigins("https://localhost:4200",
                                           "http://localhost:4200")
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                     });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseErrorHandling();
app.UseRouting();
app.UseCors("MyAllowSpecificOrigins");

app.UseHttpsRedirection();


app.UseAuthorization();

app.MapControllers();

app.Run();
