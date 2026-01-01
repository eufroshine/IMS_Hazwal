using HazwalInventoryAPI.Data;
using HazwalInventoryAPI.Models;
using HazwalInventoryAPI.Models.DTOs;
using MongoDB.Bson;
using MongoDB.Driver;

namespace HazwalInventoryAPI.Services
{
    public class ChemicalStockService : IChemicalStockService
    {
        private readonly MongoDbContext _context;

        public ChemicalStockService(MongoDbContext context)
        {
            _context = context;
        }

        // =========================
        // GET ALL CHEMICALS
        // =========================
        public async Task<List<ChemicalStock>> GetAllAsync()
        {
            return await _context.ChemicalStocks
                .Find(_ => true)
                .ToListAsync();
        }

        // =========================
        // GET CHEMICAL BY ID
        // =========================
        public async Task<ChemicalStock> GetByIdAsync(string id)
        {
            if (!ObjectId.TryParse(id, out _))
                throw new ArgumentException("Invalid chemical ID format");

            var chemical = await _context.ChemicalStocks
                .Find(c => c.Id == id)
                .FirstOrDefaultAsync();

            if (chemical == null)
                throw new KeyNotFoundException($"Chemical with ID {id} not found");

            return chemical;
        }

        // =========================
        // CREATE CHEMICAL
        // =========================
        public async Task<ChemicalStock> CreateAsync(CreateChemicalDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                throw new ArgumentException("Chemical name is required");

            var chemical = new ChemicalStock
            {
                Name = dto.Name,
                Formula = dto.Formula,
                Description = dto.Description,
                Price = dto.Price,
                Quantity = dto.Quantity,
                Unit = dto.Unit,
                MinQuantity = dto.MinQuantity,
                Supplier = dto.Supplier,
                Category = dto.Category,
                LastRestockDate = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _context.ChemicalStocks.InsertOneAsync(chemical);
            return chemical;
        }

        // =========================
        // UPDATE CHEMICAL
        // =========================
        public async Task<ChemicalStock> UpdateAsync(string id, UpdateChemicalDto dto)
        {
            if (!ObjectId.TryParse(id, out _))
                throw new ArgumentException("Invalid chemical ID format");

            var update = Builders<ChemicalStock>.Update
                .Set(c => c.Name, dto.Name)
                .Set(c => c.Price, dto.Price)
                .Set(c => c.Quantity, dto.Quantity)
                .Set(c => c.MinQuantity, dto.MinQuantity)
                .Set(c => c.Supplier, dto.Supplier)
                .Set(c => c.UpdatedAt, DateTime.UtcNow);

            var options = new FindOneAndUpdateOptions<ChemicalStock>
            {
                ReturnDocument = ReturnDocument.After
            };

            var updatedChemical = await _context.ChemicalStocks
                .FindOneAndUpdateAsync(c => c.Id == id, update, options);

            if (updatedChemical == null)
                throw new KeyNotFoundException($"Chemical with ID {id} not found");

            return updatedChemical;
        }

        // =========================
        // DELETE CHEMICAL
        // =========================
        public async Task<bool> DeleteAsync(string id)
        {
            if (!ObjectId.TryParse(id, out _))
                throw new ArgumentException("Invalid chemical ID format");

            var result = await _context.ChemicalStocks
                .DeleteOneAsync(c => c.Id == id);

            return result.DeletedCount > 0;
        }

        // =========================
        // GET LOW STOCK CHEMICALS
        // =========================
        public async Task<List<ChemicalStock>> GetLowStockAsync()
        {
            // MongoDB tidak bisa membandingkan field vs field secara langsung,
            // maka filtering dilakukan di sisi aplikasi (AMAN & BENAR).
            var allChemicals = await _context.ChemicalStocks
                .Find(_ => true)
                .ToListAsync();

            return allChemicals
                .Where(c => c.Quantity <= c.MinQuantity)
                .ToList();
        }
    }
}
