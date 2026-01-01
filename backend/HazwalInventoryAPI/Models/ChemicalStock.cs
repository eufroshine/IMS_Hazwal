// ===== Models/ChemicalStock.cs =====
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace HazwalInventoryAPI.Models
{
    [BsonIgnoreExtraElements]
    public class ChemicalStock
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("name")]
        public string Name { get; set; } // Nama bahan kimia

        [BsonElement("formula")]
        public string Formula { get; set; } // Rumus kimia, misal: H2O

        [BsonElement("description")]
        public string Description { get; set; } // Deskripsi produk

        [BsonElement("price")]
        public decimal Price { get; set; } // Harga per unit

        [BsonElement("quantity")]
        public int Quantity { get; set; } // Jumlah stok tersedia

        [BsonElement("unit")]
        public string Unit { get; set; } // Satuan: Kg, Liter, Ton, dll

        [BsonElement("minQuantity")]
        public int MinQuantity { get; set; } // Minimum stok sebelum reorder

        [BsonElement("supplier")]
        public string Supplier { get; set; } // Nama supplier

        [BsonElement("category")]
        public string Category { get; set; } // Kategori kimia

        [BsonElement("lastRestockDate")]
        public DateTime LastRestockDate { get; set; } // Tanggal restock terakhir

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
