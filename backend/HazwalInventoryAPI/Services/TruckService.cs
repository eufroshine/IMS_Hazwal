// ===== Services/TruckService.cs =====
using HazwalInventoryAPI.Data;
using HazwalInventoryAPI.Models;
using HazwalInventoryAPI.Models.DTOs;
using MongoDB.Driver;

namespace HazwalInventoryAPI.Services
{
    public class TruckService : ITruckService
    {
        private readonly MongoDbContext _context;

        public TruckService(MongoDbContext context)
        {
            _context = context;
        }

        public async Task<List<Truck>> GetAllAsync()
        {
            return await _context.Trucks.Find(_ => true).ToListAsync();
        }

        public async Task<Truck> GetByIdAsync(string id)
        {
            var truck = await _context.Trucks.Find(t => t.Id == id).FirstOrDefaultAsync();
            if (truck == null)
                throw new KeyNotFoundException($"Truck with ID {id} not found");
            return truck;
        }

        public async Task<Truck> CreateAsync(CreateTruckDto dto)
        {
            var truck = new Truck
            {
                TruckNumber = dto.TruckNumber,
                Capacity = dto.Capacity,
                CapacityUnit = dto.CapacityUnit,
                Driver = dto.Driver,
                DriverPhone = dto.DriverPhone,
                Status = "Available",
                LastMaintenanceDate = DateTime.UtcNow,
                NextMaintenanceDate = DateTime.UtcNow.AddDays(30),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _context.Trucks.InsertOneAsync(truck);
            return truck;
        }

        public async Task<Truck> UpdateAsync(string id, CreateTruckDto dto)
        {
            var update = Builders<Truck>.Update
                .Set(t => t.TruckNumber, dto.TruckNumber)
                .Set(t => t.Capacity, dto.Capacity)
                .Set(t => t.Driver, dto.Driver)
                .Set(t => t.DriverPhone, dto.DriverPhone)
                .Set(t => t.UpdatedAt, DateTime.UtcNow);

            var options = new FindOneAndUpdateOptions<Truck> { ReturnDocument = ReturnDocument.After };
            var updated = await _context.Trucks.FindOneAndUpdateAsync(t => t.Id == id, update, options);

            if (updated == null)
                throw new KeyNotFoundException($"Truck with ID {id} not found");

            return updated;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var result = await _context.Trucks.DeleteOneAsync(t => t.Id == id);
            return result.DeletedCount > 0;
        }

        public async Task<List<Truck>> GetAvailableTrucksAsync()
        {
            return await _context.Trucks.Find(t => t.Status == "Available").ToListAsync();
        }

        public async Task<Truck> UpdateStatusAsync(string id, string status)
        {
            var update = Builders<Truck>.Update
                .Set(t => t.Status, status)
                .Set(t => t.UpdatedAt, DateTime.UtcNow);

            var options = new FindOneAndUpdateOptions<Truck> { ReturnDocument = ReturnDocument.After };
            return await _context.Trucks.FindOneAndUpdateAsync(t => t.Id == id, update, options);
        }
    }
}