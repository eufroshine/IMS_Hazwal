// ===== Models/Delivery.cs =====
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace HazwalInventoryAPI.Models
{
    [BsonIgnoreExtraElements]
    public class Delivery
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("deliveryNumber")]
        public string DeliveryNumber { get; set; } // Nomor pengiriman unik, misal: DLV-001

        [BsonElement("deliveryDate")]
        public DateTime DeliveryDate { get; set; } // Tanggal pengiriman dijadwalkan

        [BsonElement("chemicalStockId")]
        public string ChemicalStockId { get; set; } // Reference ke ChemicalStock

        [BsonElement("chemicalName")]
        public string ChemicalName { get; set; } // Cached name untuk kemudahan

        [BsonElement("quantity")]
        public int Quantity { get; set; } // Jumlah yang dikirim

        [BsonElement("unit")]
        public string Unit { get; set; }

        [BsonElement("truckAssignments")]
        public List<TruckAssignment> TruckAssignments { get; set; } = new();

        [BsonElement("destination")]
        public string Destination { get; set; } // Alamat tujuan pengiriman

        [BsonElement("status")]
        public string Status { get; set; } // Scheduled, OnDelivery, Completed, Cancelled

        [BsonElement("notes")]
        public string Notes { get; set; } // Catatan pengiriman

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public class TruckAssignment
    {
        [BsonElement("truckId")]
        public string TruckId { get; set; }

        [BsonElement("truckNumber")]
        public string TruckNumber { get; set; }

        [BsonElement("driver")]
        public string Driver { get; set; }

        [BsonElement("assignmentDate")]
        public DateTime AssignmentDate { get; set; } = DateTime.UtcNow;

        [BsonElement("status")]
        public string Status { get; set; } // Assigned, OnWay, Delivered
    }
}