using System.Collections.Generic;

namespace LaundryManagement.API.DTOs
{
    public class CreateOrderDto
    {
        public string? Notes { get; set; }
         public int CustomerId { get; set; }
        public List<CreateOrderItemDto> Items { get; set; } = new();
    }
}