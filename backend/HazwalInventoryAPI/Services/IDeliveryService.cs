// ===== Services/IDeliveryService.cs =====
using HazwalInventoryAPI.Models;
using HazwalInventoryAPI.Models.DTOs;

namespace HazwalInventoryAPI.Services
{
    public interface IDeliveryService
    {
        Task<List<Delivery>> GetAllAsync();
        Task<Delivery> GetByIdAsync(string id);
        Task<Delivery> CreateAsync(CreateDeliveryDto dto);
        Task<Delivery> UpdateStatusAsync(string id, UpdateDeliveryStatusDto dto);
        Task<bool> DeleteAsync(string id);
        Task<List<Delivery>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
    }
}