using System;

namespace LaundryManagement.API.models
{
    public class Staff
    {
        public int StaffId { get; set; }
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Position { get; set; }
        public DateTime HiredAt { get; set; } = DateTime.UtcNow;

        // Link to ApplicationUser
        public string ApplicationUserId { get; set; } = null!;
        public ApplicationUser ApplicationUser { get; set; } = null!;
    }
}