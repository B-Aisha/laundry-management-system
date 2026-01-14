using Microsoft.EntityFrameworkCore;
using LaundryManagement.API.models;

namespace LaundryManagement.API.data
{
    public class LaundryDbContext : DbContext
    {
        public LaundryDbContext(DbContextOptions<LaundryDbContext> options)
            : base(options)
        {
        }

        public DbSet<ApplicationUser> ApplicationsUsers => Set<ApplicationUser>();
        public DbSet<Order> Orders => Set<Order>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User → Orders (1-to-many)
            modelBuilder.Entity<ApplicationUser>()
                .HasMany(u => u.Orders)
                .WithOne(o => o.ApplicationUser)
                .HasForeignKey(o => o.ApplicationUserId);
        }
    }
}
