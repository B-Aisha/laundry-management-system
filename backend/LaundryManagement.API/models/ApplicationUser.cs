using Microsoft.AspNetCore.Identity;

namespace LaundryManagementAPI.models
{
    public class ApplicationUser : IdentityUser
    {
        // You can still add custom fields here
         public string? FullName { get; set; }

            public string? Role { get; set; }// Use carefully; we'll handle this with claims or role manager too

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        
        //public Customer? Customer { get; set; }
        //public Staff? Staff { get; set; }
        //public ICollection<Order> Orders { get; set; } = new List<Order>();
        
    }
}
