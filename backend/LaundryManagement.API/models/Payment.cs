using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace LaundryManagement.API.models
{
    public class Payment
    {
        public int PaymentId { get; set; }

        public int OrderId { get; set; }
        public Order Order { get; set; } = null!;

        // MPesa, Card, Cash
        public string Method { get; set; } = null!;

        // Pending, Completed, Failed
        public string Status { get; set; } = "Pending";

        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        // M-Pesa transaction ID or Stripe payment intent ID
        public string? TransactionId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? PaidAt { get; set; }
    }
}