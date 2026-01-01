// ===== Services/ITruckService.cs =====
using HazwalInventoryAPI.Models;
using HazwalInventoryAPI.Models.DTOs;

namespace HazwalInventoryAPI.Services
{
    public interface ITruckService
    {
        Task<List<Truck>> GetAllAsync();
        Task<Truck> GetByIdAsync(string id);
        Task<Truck> CreateAsync(CreateTruckDto dto);
        Task<Truck> UpdateAsync(string id, CreateTruckDto dto);
        Task<bool> DeleteAsync(string id);
        Task<List<Truck>> GetAvailableTrucksAsync();
        Task<Truck> UpdateStatusAsync(string id, string status);
    }
}