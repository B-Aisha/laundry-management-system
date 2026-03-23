using LaundryManagement.API.data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LaundryManagement.API.Controllers
{
    [ApiController]
    [Route("api/reports")]
    public class ReportsController : ControllerBase
    {
        private readonly LaundryDbContext _context;

        public ReportsController(LaundryDbContext context)
        {
            _context = context;
        }

        // GET api/reports/summary
        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Service)
                .Include(o => o.AssignedStaff)
                .ToListAsync();

            // Total revenue
            var totalRevenue = orders
                .Where(o => o.Status == "Completed")
                .Sum(o => o.TotalPrice ?? 0);

            // Orders by status
            var ordersByStatus = orders
                .GroupBy(o => o.Status)
                .Select(g => new { Status = g.Key, Count = g.Count() })
                .ToList();

            // Top services by usage
            var topServices = orders
                .SelectMany(o => o.OrderItems)
                .GroupBy(oi => oi.Service.Name)
                .Select(g => new
                {
                    ServiceName = g.Key,
                    TotalQuantity = g.Sum(oi => oi.Quantity),
                    TotalRevenue = g.Sum(oi => oi.Quantity * oi.UnitPrice)
                })
                .OrderByDescending(s => s.TotalQuantity)
                .ToList();

            // Staff performance
            var staffPerformance = orders
                .Where(o => o.AssignedStaff != null)
                .GroupBy(o => o.AssignedStaff!.FullName)
                .Select(g => new
                {
                    StaffName = g.Key,
                    TotalAssigned = g.Count(),
                    Completed = g.Count(o => o.Status == "Completed"),
                    Cancelled = g.Count(o => o.Status == "Cancelled"),
                    Processing = g.Count(o => o.Status == "Processing")
                })
                .OrderByDescending(s => s.Completed)
                .ToList();

            return Ok(new
            {
                totalRevenue,
                totalOrders = orders.Count,
                ordersByStatus,
                topServices,
                staffPerformance
            });
        }
    }
}