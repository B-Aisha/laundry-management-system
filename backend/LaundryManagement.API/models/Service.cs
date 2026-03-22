using System.ComponentModel.DataAnnotations.Schema;

namespace LaundryManagement.API.models
{
    public class Service
    {
        public int ServiceId { get; set; }
        public string Name { get; set; } = null!;         // e.g. "Wash", "Iron"
        public string? Description { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal PricePerUnit { get; set; }         // e.g. 150.00 per kg

        public string Unit { get; set; } = "kg";          // kg, piece, bag, etc.
        public bool IsActive { get; set; } = true;
    }
}