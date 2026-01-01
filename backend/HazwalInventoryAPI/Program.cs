using HazwalInventoryAPI.Data;
using HazwalInventoryAPI.Middleware;
using HazwalInventoryAPI.Services;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

// =======================
// Load environment variables
// =======================
DotNetEnv.Env.Load();

// =======================
// MongoDB Configuration
// =======================
var mongoConnectionString =
    Environment.GetEnvironmentVariable("MONGODB_CONNECTION_STRING")
    ?? "mongodb://localhost:27017";

var mongoDatabaseName =
    Environment.GetEnvironmentVariable("MONGODB_DATABASE_NAME")
    ?? "HazwalInventory";

// Configure MongoDbSettings for DI
builder.Services.Configure<MongoDbSettings>(options =>
{
    options.ConnectionString = mongoConnectionString;
    options.DatabaseName = mongoDatabaseName;
});

builder.Services.AddSingleton<IMongoClient>(
    new MongoClient(mongoConnectionString)
);

// Register IMongoDatabase for DI so controllers can inject it directly
builder.Services.AddSingleton<IMongoDatabase>(sp =>
{
    var client = sp.GetRequiredService<IMongoClient>();
    return client.GetDatabase(mongoDatabaseName);
});

builder.Services.AddScoped<MongoDbContext>();

// =======================
// Register Services
// =======================
builder.Services.AddScoped<IChemicalStockService, ChemicalStockService>();
builder.Services.AddScoped<ITruckService, TruckService>();
builder.Services.AddScoped<IDeliveryService, DeliveryService>();
builder.Services.AddScoped<IPdfReportService, PdfReportService>();

// =======================
// Controllers & Swagger
// =======================
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// =======================
// CORS
// =======================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        var originsEnv = Environment.GetEnvironmentVariable("CORS_ORIGIN") ?? "http://localhost:3000";
        var origins = originsEnv.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries)
            .Select(o => o.Trim())
            .ToArray();

        // In development, allow any origin to simplify local testing (will echo request origin back)
        if (builder.Environment.IsDevelopment())
        {
            policy.SetIsOriginAllowed(_ => true)
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        }
        else
        {
            policy.WithOrigins(origins)
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        }
    });
});

var app = builder.Build();

// =======================
// Middleware pipeline
// =======================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

app.Run();
