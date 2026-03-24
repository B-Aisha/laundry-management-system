using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace LaundryManagement.API.models
{
    public class Order
    {
        public int OrderId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Pending, Processing, Completed, Cancelled
        public string Status { get; set; } = "Pending";
        public string? Notes { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? TotalPrice { get; set; }

        // Who placed the order
        public string ApplicationUserId { get; set; } = null!;
        public ApplicationUser ApplicationUser { get; set; } = null!;

        // Link directly to Customer table
        public int CustomerId { get; set; }
        public Customer Customer { get; set; } = null!;

        // Which staff is handling it (nullable - not assigned yet when Pending)
        public int? AssignedStaffId { get; set; }
        public Staff? AssignedStaff { get; set; }

        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

        public string PaymentStatus { get; set; } = "Unpaid"; // Unpaid, Paid, PendingDelivery
    }
}