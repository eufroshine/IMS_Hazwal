// ===== Services/DeliveryService.cs =====
using HazwalInventoryAPI.Data;
using HazwalInventoryAPI.Models;
using HazwalInventoryAPI.Models.DTOs;
using MongoDB.Driver;

namespace HazwalInventoryAPI.Services
{
    public class DeliveryService : IDeliveryService
    {
        private readonly MongoDbContext _context;
        private readonly bool _allowSameDayMultipleAssignments;

        public DeliveryService(MongoDbContext context, Microsoft.Extensions.Configuration.IConfiguration configuration)
        {
            _context = context;
            _allowSameDayMultipleAssignments = configuration.GetValue<bool>("Delivery:AllowSameDayMultipleAssignments", false);
        }

        public async Task<List<Delivery>> GetAllAsync()
        {
            return await _context.Deliveries.Find(_ => true).ToListAsync();
        }

        public async Task<Delivery> GetByIdAsync(string id)
        {
            var delivery = await _context.Deliveries.Find(d => d.Id == id).FirstOrDefaultAsync();
            if (delivery == null)
                throw new KeyNotFoundException($"Delivery with ID {id} not found");
            return delivery;
        }

        public async Task<Delivery> CreateAsync(CreateDeliveryDto dto)
        {
            var chemical = await _context.ChemicalStocks.Find(c => c.Id == dto.ChemicalStockId).FirstOrDefaultAsync();
            if (chemical == null)
                throw new ArgumentException("Chemical not found");

            if (chemical.Quantity < dto.Quantity)
                throw new ArgumentException("Insufficient stock");

            // Prevent assigning trucks that are already assigned for the same delivery date
            var truckAssignments = new List<TruckAssignment>();
            foreach (var truckId in dto.TruckIds ?? new List<string>())
            {
                // Check existing deliveries on the same date that are not cancelled
                var startOfDay = dto.DeliveryDate.Date;
                var endOfDay = dto.DeliveryDate.Date.AddDays(1).AddTicks(-1);

                var filter = Builders<Delivery>.Filter.And(
                    Builders<Delivery>.Filter.Gte(d => d.DeliveryDate, startOfDay),
                    Builders<Delivery>.Filter.Lte(d => d.DeliveryDate, endOfDay),
                    Builders<Delivery>.Filter.Ne(d => d.Status, "Cancelled"),
                    Builders<Delivery>.Filter.ElemMatch(d => d.TruckAssignments, ta => ta.TruckId == truckId)
                );

                var conflict = await _context.Deliveries.Find(filter).FirstOrDefaultAsync();
                if (conflict != null)
                {
                    if (!_allowSameDayMultipleAssignments)
                    {
                        throw new ArgumentException($"Truck with ID {truckId} is already assigned for the selected date");
                    }
                    // else: allowed to have multiple assignments same day, continue and capture the truck
                }

                var truck = await _context.Trucks.Find(t => t.Id == truckId).FirstOrDefaultAsync();
                if (truck != null)
                {
                    truckAssignments.Add(new TruckAssignment
                    {
                        TruckId = truck.Id,
                        TruckNumber = truck.TruckNumber,
                        Driver = truck.Driver,
                        AssignmentDate = DateTime.UtcNow,
                        Status = "Assigned"
                    });
                }
            }

            var delivery = new Delivery
            {
                DeliveryNumber = $"DLV-{DateTime.UtcNow:yyyyMMddHHmmss}",
                DeliveryDate = dto.DeliveryDate,
                ChemicalStockId = dto.ChemicalStockId,
                ChemicalName = chemical.Name,
                Quantity = dto.Quantity,
                Unit = chemical.Unit,
                TruckAssignments = truckAssignments,
                Destination = dto.Destination,
                Status = "Scheduled",
                Notes = dto.Notes,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _context.Deliveries.InsertOneAsync(delivery);

            // Update chemical stock
            await _context.ChemicalStocks.UpdateOneAsync(
                c => c.Id == dto.ChemicalStockId,
                Builders<ChemicalStock>.Update.Set(c => c.Quantity, chemical.Quantity - dto.Quantity)
            );

            return delivery;
        }

        public async Task<Delivery> UpdateStatusAsync(string id, UpdateDeliveryStatusDto dto)
        {
            // If changing to OnDelivery, ensure none of the trucks are currently OnDelivery on the same date
            if (dto.Status == "OnDelivery")
            {
                var current = await _context.Deliveries.Find(d => d.Id == id).FirstOrDefaultAsync();
                if (current == null)
                    throw new KeyNotFoundException($"Delivery with ID {id} not found");

                var truckIds = current.TruckAssignments?.Select(t => t.TruckId).Where(x => !string.IsNullOrEmpty(x)).ToList() ?? new List<string>();
                if (truckIds.Any())
                {
                    var startOfDay = current.DeliveryDate.Date;
                    var endOfDay = current.DeliveryDate.Date.AddDays(1).AddTicks(-1);

                    // Build filter: other deliveries on same date with status OnDelivery and having any of these truckIds
                    var truckFilters = new List<FilterDefinition<Delivery>>();
                    foreach (var tid in truckIds)
                    {
                        truckFilters.Add(Builders<Delivery>.Filter.ElemMatch(d => d.TruckAssignments, ta => ta.TruckId == tid));
                    }

                    var filter = Builders<Delivery>.Filter.And(
                        Builders<Delivery>.Filter.Gte(d => d.DeliveryDate, startOfDay),
                        Builders<Delivery>.Filter.Lte(d => d.DeliveryDate, endOfDay),
                        Builders<Delivery>.Filter.Eq(d => d.Status, "OnDelivery"),
                        Builders<Delivery>.Filter.Ne(d => d.Id, id),
                        Builders<Delivery>.Filter.Or(truckFilters)
                    );

                    var conflict = await _context.Deliveries.Find(filter).FirstOrDefaultAsync();
                    if (conflict != null)
                        throw new ArgumentException("One or more trucks assigned to this delivery are currently OnDelivery for the same date");
                }
            }

            var update = Builders<Delivery>.Update
                .Set(d => d.Status, dto.Status)
                .Set(d => d.UpdatedAt, DateTime.UtcNow);

            var options = new FindOneAndUpdateOptions<Delivery> { ReturnDocument = ReturnDocument.After };
            var updated = await _context.Deliveries.FindOneAndUpdateAsync(d => d.Id == id, update, options);

            if (updated == null)
                throw new KeyNotFoundException($"Delivery with ID {id} not found");

            return updated;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var result = await _context.Deliveries.DeleteOneAsync(d => d.Id == id);
            return result.DeletedCount > 0;
        }

        public async Task<List<Delivery>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            var filter = Builders<Delivery>.Filter.And(
                Builders<Delivery>.Filter.Gte(d => d.DeliveryDate, startDate),
                Builders<Delivery>.Filter.Lte(d => d.DeliveryDate, endDate)
            );
            return await _context.Deliveries.Find(filter).ToListAsync();
        }
    }
}