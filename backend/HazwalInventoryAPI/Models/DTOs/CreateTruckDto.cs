// ===== Models/DTOs/CreateTruckDto.cs =====
namespace HazwalInventoryAPI.Models.DTOs
{
    public class CreateTruckDto
    {
        public string TruckNumber { get; set; }
        public decimal Capacity { get; set; }
        public string CapacityUnit { get; set; }
        public string Driver { get; set; }
        public string DriverPhone { get; set; }
    }
}