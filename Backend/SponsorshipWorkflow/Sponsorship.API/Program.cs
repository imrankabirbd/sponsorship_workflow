using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Sponsorship.API;
using Sponsorship.Application.Interfaces;
using Sponsorship.Application.Services;
using Sponsorship.Infrastructure.Data;
using Sponsorship.Infrastructure.Repositories;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();


builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Sponsorship API",
        Version = "v1",
        Description = "API for Sponsorship Request Workflow System"
    });

    c.AddSecurityDefinition("ApiKey", new OpenApiSecurityScheme
    {
        Name = "api_key",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "ApiKeyScheme",
        In = ParameterLocation.Header,
        Description = "Enter your API key: spworkflow@pi",
        BearerFormat = "text"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "ApiKey"
                },
                Name = "api_key",
                In = ParameterLocation.Header
            },
            new List<string>()
        }
    });
});

// Database configuration
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

//Dependency Injection
builder.Services.AddScoped(typeof(IRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IRequestRepository, RequestRepository>();

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IRequestorService, RequestorService>();
builder.Services.AddScoped<IManagerService, ManagerService>();
builder.Services.AddScoped<IFinanceService, FinanceService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<ISponsorshipTypeService, SponsorshipTypeService>();


// CORS for Angular
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Configure pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAngular");

app.UseMiddleware<ApiKeyMiddleware>();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

// Apply migrations automatically
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
}

app.Run();