using System;

namespace LaundryManagement.API.models
{
    public class Staff
    {
        public int Id { get; set; }
        public string? Position { get; set; }
        public DateTime HiredAt { get; set; } = DateTime.UtcNow;

        // Link to ApplicationUser
        public string ApplicationUserId { get; set; } = null!;
        public ApplicationUser ApplicationUser { get; set; } = null!;
    }
}