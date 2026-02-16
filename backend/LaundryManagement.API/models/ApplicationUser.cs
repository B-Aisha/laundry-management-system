using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

namespace LaundryManagement.API.models
{
    public class ApplicationUser : IdentityUser
    {
        // Profile info
        public string? FullName { get; set; }

        public string? Address { get; set; }

        // Prefer using Identity Roles, but keeping for flexibility
        public string? Role { get; set; }

        // Audit
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}
