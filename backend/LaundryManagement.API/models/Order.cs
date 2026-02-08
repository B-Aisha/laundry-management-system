using System;

namespace LaundryManagement.API.models
{
    public class Order
    {
        public int Id { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string Status { get; set; } = "Pending";

        // Foreign Key to Identity User (string)
        public string ApplicationUserId { get; set; } = default!;

        // Navigation Property
        public ApplicationUser ApplicationUser { get; set; } = default!;
    }
}
