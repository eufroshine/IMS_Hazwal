using HazwalInventoryAPI.Models;
using MongoDB.Driver;
using Microsoft.Extensions.Options;

namespace HazwalInventoryAPI.Data
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;

        public MongoDbContext(IOptions<MongoDbSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            _database = client.GetDatabase(settings.Value.DatabaseName);
        }

        public IMongoCollection<ChemicalStock> ChemicalStocks =>
            _database.GetCollection<ChemicalStock>("chemical_stocks");

        public IMongoCollection<Truck> Trucks =>
            _database.GetCollection<Truck>("trucks");

        public IMongoCollection<Delivery> Deliveries =>
            _database.GetCollection<Delivery>("deliveries");
    }
}
