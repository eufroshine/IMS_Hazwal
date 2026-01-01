// ===== Models/Truck.cs =====
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace HazwalInventoryAPI.Models
{
    [BsonIgnoreExtraElements]
    public class Truck
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("truckNumber")]
        public string TruckNumber { get; set; } // Nomor plat kendaraan

        [BsonElement("capacity")]
        public decimal Capacity { get; set; } // Kapasitas dalam Kg/Liter

        [BsonElement("capacityUnit")]
        public string CapacityUnit { get; set; } // Satuan kapasitas

        [BsonElement("driver")]
        public string Driver { get; set; } // Nama driver

        [BsonElement("driverPhone")]
        public string DriverPhone { get; set; } // Nomor telepon driver

        [BsonElement("status")]
        public string Status { get; set; } // Available, InUse, Maintenance

        [BsonElement("lastMaintenanceDate")]
        public DateTime LastMaintenanceDate { get; set; }

        [BsonElement("nextMaintenanceDate")]
        public DateTime NextMaintenanceDate { get; set; }

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}