// ===== Services/IPdfReportService.cs =====
using HazwalInventoryAPI.Models;

namespace HazwalInventoryAPI.Services
{
    public interface IPdfReportService
    {
        Task<byte[]> GenerateChemicalStockReportAsync(List<ChemicalStock> chemicals);
        Task<byte[]> GenerateDeliveryReportAsync(List<Delivery> deliveries);
        Task<byte[]> GenerateTruckStatusReportAsync(List<Truck> trucks);
    }
}
