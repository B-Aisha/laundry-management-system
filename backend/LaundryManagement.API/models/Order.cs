namespace LaundryManagement.API.models
{
    public class Order
    {
        public int Id { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Pending, Received, Washing, Ready, Collected
        public string Status { get; set; } = "Pending";

        // FK
        public int UserId { get; set; }

        // Navigation
        //public User User { get; set; } = null!;
    }
}
