namespace LaundryManagement.API.DTOs
{
    public class ServiceDto
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public decimal PricePerUnit { get; set; }
        public string Unit { get; set; } = "kg";
    }
}