// ===== Models/DTOs/CreateChemicalDto.cs =====
namespace HazwalInventoryAPI.Models.DTOs
{
    public class CreateChemicalDto
    {
        public string Name { get; set; }
        public string Formula { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public string Unit { get; set; }
        public int MinQuantity { get; set; }
        public string Supplier { get; set; }
        public string Category { get; set; }
    }

    public class UpdateChemicalDto
    {
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public int MinQuantity { get; set; }
        public string Supplier { get; set; }
    }
}
