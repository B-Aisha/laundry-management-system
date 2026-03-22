using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using LaundryManagement.API.models;

namespace LaundryManagement.API.data
{
    public class LaundryDbContext : IdentityDbContext<ApplicationUser>
    {
        public LaundryDbContext(DbContextOptions<LaundryDbContext> options)
            : base(options)
        {
        }

        public DbSet<Order> Orders => Set<Order>();
        public DbSet<Customer> Customers => Set<Customer>(); 
        public DbSet<Staff> Staffs => Set<Staff>();   

        public DbSet<Service> Services => Set<Service>();
        public DbSet<OrderItem> OrderItems => Set<OrderItem>();      

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Order relationship
            modelBuilder.Entity<Order>()
                .HasOne(o => o.ApplicationUser)
                .WithMany(u => u.Orders)
                .HasForeignKey(o => o.ApplicationUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // CustomerProfile - one to one with ApplicationUser
            modelBuilder.Entity<Customer>()
                .HasOne(c => c.ApplicationUser)
                .WithOne(u => u.Customer)
                .HasForeignKey<Customer>(c => c.ApplicationUserId)
                .OnDelete(DeleteBehavior.Cascade);

            // StaffProfile - one to one with ApplicationUser
            modelBuilder.Entity<Staff>()
                .HasOne(s => s.ApplicationUser)
                .WithOne(u => u.Staff)
                .HasForeignKey<Staff>(s => s.ApplicationUserId)
                .OnDelete(DeleteBehavior.Cascade);

               // OrderItem → Order
            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.OrderItems)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // OrderItem → Service
            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Service)
                .WithMany()
                .HasForeignKey(oi => oi.ServiceId)
                .OnDelete(DeleteBehavior.Restrict);

            // Subtotal is computed, not stored
            modelBuilder.Entity<OrderItem>()
                .Ignore(oi => oi.Subtotal);

            // Order → Customer
            modelBuilder.Entity<Order>()
                .HasOne(o => o.Customer)
                .WithMany()
                .HasForeignKey(o => o.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            // Order → Staff (nullable)
            modelBuilder.Entity<Order>()
                .HasOne(o => o.AssignedStaff)
                .WithMany()
                .HasForeignKey(o => o.AssignedStaffId)
                .OnDelete(DeleteBehavior.SetNull)
                .IsRequired(false);
        }
    }
}