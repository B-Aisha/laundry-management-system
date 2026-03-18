namespace LaundryManagement.API.models
{
    public class Customer
    {
        public int CustomerId { get; set; }
        public string? FullName { get; set; } 
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }

        // Link to ApplicationUser
        public string ApplicationUserId { get; set; } = null!;
        public ApplicationUser ApplicationUser { get; set; } = null!;
    }
}