using System.ComponentModel.DataAnnotations.Schema;

namespace LaundryManagement.API.models
{
    public class OrderItem
    {
        public int OrderItemId { get; set; }

        public int OrderId { get; set; }
        public Order Order { get; set; } = null!;

        public int ServiceId { get; set; }
        public Service Service { get; set; } = null!;


        [Column(TypeName = "decimal(18,2)")]
        public decimal Quantity { get; set; }             // e.g. 2.5 kg

        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }            // snapshot of price at time of order

        [Column(TypeName = "decimal(18,2)")]
        public decimal Subtotal => Quantity * UnitPrice;  // computed
    }
}