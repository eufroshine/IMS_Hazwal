// ===== Models/DTOs/CreateDeliveryDto.cs =====
namespace HazwalInventoryAPI.Models.DTOs
{
    public class CreateDeliveryDto
    {
        public DateTime DeliveryDate { get; set; }
        public string ChemicalStockId { get; set; }
        public int Quantity { get; set; }
        public string Destination { get; set; }
        public List<string> TruckIds { get; set; }
        public string Notes { get; set; }
    }

    public class UpdateDeliveryStatusDto
    {
        public string Status { get; set; } // Scheduled, OnDelivery, Completed, Cancelled
    }
}