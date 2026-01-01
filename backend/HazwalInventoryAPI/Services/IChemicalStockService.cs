// ===== Services/IChemicalStockService.cs =====
using HazwalInventoryAPI.Models;
using HazwalInventoryAPI.Models.DTOs;

namespace HazwalInventoryAPI.Services
{
    public interface IChemicalStockService
    {
        Task<List<ChemicalStock>> GetAllAsync();
        Task<ChemicalStock> GetByIdAsync(string id);
        Task<ChemicalStock> CreateAsync(CreateChemicalDto dto);
        Task<ChemicalStock> UpdateAsync(string id, UpdateChemicalDto dto);
        Task<bool> DeleteAsync(string id);
        Task<List<ChemicalStock>> GetLowStockAsync();
    }
}