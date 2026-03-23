using LaundryManagement.API.data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LaundryManagement.API.Controllers
{
    [ApiController]
    [Route("api/notifications")]
    public class NotificationsController : ControllerBase
    {
        private readonly LaundryDbContext _context;

        public NotificationsController(LaundryDbContext context)
        {
            _context = context;
        }

        // GET api/notifications/{customerId}
        [HttpGet("{customerId}")]
        public async Task<IActionResult> GetNotifications(int customerId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.CustomerId == customerId)
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => new
                {
                    n.NotificationId,
                    n.Message,
                    n.IsRead,
                    n.CreatedAt
                })
                .ToListAsync();

            return Ok(notifications);
        }

        // PUT api/notifications/{id}/read
        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification == null) return NotFound();

            notification.IsRead = true;
            await _context.SaveChangesAsync();

            return Ok(new { notification.NotificationId, notification.IsRead });
        }

        // PUT api/notifications/{customerId}/read-all
        [HttpPut("{customerId}/read-all")]
        public async Task<IActionResult> MarkAllAsRead(int customerId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.CustomerId == customerId && !n.IsRead)
                .ToListAsync();

            notifications.ForEach(n => n.IsRead = true);
            await _context.SaveChangesAsync();

            return Ok(new { updated = notifications.Count });
        }
    }
}