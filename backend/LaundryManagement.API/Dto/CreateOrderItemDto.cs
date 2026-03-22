namespace LaundryManagement.API.DTOs
{
    public class CreateOrderItemDto
    {
        public int ServiceId { get; set; }
        public decimal Quantity { get; set; }
    }
}