using System.Security.Claims;
using LaundryManagement.API.data;
using LaundryManagement.API.DTOs;
using LaundryManagement.API.models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LaundryManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly LaundryDbContext _context;
        private readonly EmailService _emailService;

        public OrdersController(LaundryDbContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // POST api/orders
       [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
        {
            // Find customer directly using CustomerId from the request
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.CustomerId == dto.CustomerId);

            if (customer == null)
                return BadRequest("No customer profile found.");

            if (dto.Items == null || dto.Items.Count == 0)
                return BadRequest("An order must have at least one item.");

            var serviceIds = dto.Items.Select(i => i.ServiceId).ToList();
            var services = await _context.Services
                .Where(s => serviceIds.Contains(s.ServiceId) && s.IsActive)
                .ToListAsync();

            var missingIds = serviceIds.Except(services.Select(s => s.ServiceId)).ToList();
            if (missingIds.Any())
                return BadRequest($"Service(s) not found or inactive: {string.Join(", ", missingIds)}");

            var orderItems = dto.Items.Select(item =>
            {
                var service = services.First(s => s.ServiceId == item.ServiceId);
                return new OrderItem
                {
                    ServiceId = item.ServiceId,
                    Quantity = item.Quantity,
                    UnitPrice = service.PricePerUnit
                };
            }).ToList();

            var totalPrice = orderItems.Sum(oi => oi.Quantity * oi.UnitPrice);

            var order = new Order
            {
                ApplicationUserId = customer.ApplicationUserId,
                CustomerId = customer.CustomerId,
                Notes = dto.Notes,
                Status = "Pending",
                TotalPrice = totalPrice,
                OrderItems = orderItems
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Notify customer — order placed
            var placedNotification = new Notification
            {
                CustomerId = customer.CustomerId,
                Message = $"Your order #{order.OrderId} has been placed successfully. Total: KES {order.TotalPrice:F2}."
            };
            _context.Notifications.Add(placedNotification);
            await _context.SaveChangesAsync();

           // Send email — order placed
            await _emailService.SendEmailAsync(
                customer.Email!,
                customer.FullName ?? "Customer",
                "Order Placed Successfully",
                $@"<h2>Order Confirmed!</h2>
                <p>Hi {customer.FullName},</p>
                <p>Your order <strong>#{order.OrderId}</strong> has been placed successfully.</p>
                <p>Total: <strong>KES {order.TotalPrice:F2}</strong></p>
                <p>We'll notify you once it's assigned to a staff member.</p>
                <br/><p>Thank you for choosing Laundry Services!</p>"
            ); 

            return Ok(new
            {
                order.OrderId,
                order.Status,
                order.TotalPrice,
                order.Notes,
                order.CreatedAt,
                Items = orderItems.Select(oi => new
                {
                    oi.ServiceId,
                    oi.Quantity,
                    oi.UnitPrice,
                    Subtotal = oi.Quantity * oi.UnitPrice
                })
            });
        }

        // GET api/orders/customer/{customerId}
        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetOrdersByCustomer(int customerId)
        {
            var orders = await _context.Orders
                .Where(o => o.CustomerId == customerId)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Service)
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new
                {
                    o.OrderId,
                    o.Status,
                    o.PaymentStatus,
                    o.TotalPrice,
                    o.Notes,
                    o.CreatedAt,
                    o.UpdatedAt,
                    Items = o.OrderItems.Select(oi => new
                    {
                        oi.OrderItemId,
                        ServiceName = oi.Service.Name,
                        oi.Quantity,
                        oi.UnitPrice,
                        Subtotal = oi.Quantity * oi.UnitPrice
                    })
                })
                .ToListAsync();

            return Ok(orders);
        }


        // GET api/orders
        [HttpGet]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.AssignedStaff)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Service)
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new
                {
                    o.OrderId,
                    o.Status,
                    o.PaymentStatus,
                    o.TotalPrice,
                    o.Notes,
                    o.CreatedAt,
                    o.UpdatedAt,
                    Customer = new
                    {
                        o.Customer.CustomerId,
                        o.Customer.FullName,
                        o.Customer.Email,
                        o.Customer.Phone
                    },
                    AssignedStaff = o.AssignedStaff == null ? null : new
                    {
                        o.AssignedStaff.StaffId,
                        o.AssignedStaff.FullName
                    },
                    Items = o.OrderItems.Select(oi => new
                    {
                        oi.OrderItemId,
                        ServiceName = oi.Service.Name,
                        oi.Quantity,
                        oi.UnitPrice,
                        Subtotal = oi.Quantity * oi.UnitPrice
                    })
                })
                .ToListAsync();

            return Ok(orders);
        }

        // PUT api/orders/{orderId}/assign/{staffId}
        [HttpPut("{orderId}/assign/{staffId}")]
        public async Task<IActionResult> AssignStaff(int orderId, int staffId)
        {
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.OrderId == orderId);
            if (order == null) return NotFound("Order not found.");

            var staff = await _context.Staffs.FirstOrDefaultAsync(s => s.StaffId == staffId);
            if (staff == null) return NotFound("Staff not found.");

            order.AssignedStaffId = staffId;
            order.Status = "Processing";
            order.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Notify customer — order assigned
            var assignedNotification = new Notification
            {
                CustomerId = order.CustomerId,
                Message = $"Your order #{order.OrderId} has been assigned to a staff member and is now being processed."
            };
            _context.Notifications.Add(assignedNotification);
            await _context.SaveChangesAsync();

            // Send email — order assigned
            var orderCustomer = await _context.Customers
                .FirstOrDefaultAsync(c => c.CustomerId == order.CustomerId);

            if (orderCustomer != null)
            {
                await _emailService.SendEmailAsync(
                    orderCustomer.Email!,
                    orderCustomer.FullName ?? "Customer",
                    "Your Order is Being Processed",
                    $@"<h2>Order Update</h2>
                    <p>Hi {orderCustomer.FullName},</p>
                    <p>Your order <strong>#{order.OrderId}</strong> has been assigned to a staff member and is now being processed.</p>
                    <p>We'll notify you once it's ready for pickup.</p>
                    <br/><p>Thank you for choosing Laundry Services!</p>"
                );
            }


            return Ok(new
            {
                order.OrderId,
                order.Status,
                order.AssignedStaffId,
                AssignedStaffName = staff.FullName,
                order.UpdatedAt
            });
        }

        // GET api/orders/staff/{staffId}
        [HttpGet("staff/{staffId}")]
        public async Task<IActionResult> GetOrdersByStaff(int staffId)
        {
            var orders = await _context.Orders
                .Where(o => o.AssignedStaffId == staffId)
                .Include(o => o.Customer)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Service)
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new
                {
                    o.OrderId,
                    o.Status,
                    o.TotalPrice,
                    o.Notes,
                    o.CreatedAt,
                    o.UpdatedAt,
                    Customer = new
                    {
                        o.Customer.FullName,
                        o.Customer.Email,
                        o.Customer.Phone
                    },
                    Items = o.OrderItems.Select(oi => new
                    {
                        oi.OrderItemId,
                        ServiceName = oi.Service.Name,
                        oi.Quantity,
                        oi.UnitPrice,
                        Subtotal = oi.Quantity * oi.UnitPrice
                    })
                })
                .ToListAsync();

            return Ok(orders);
        }

        // PUT api/orders/{orderId}/status
        [HttpPut("{orderId}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int orderId, [FromBody] UpdateStatusDto dto)
        {
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.OrderId == orderId);
            if (order == null) return NotFound("Order not found.");

            var allowed = new[] { "Processing", "Completed", "Cancelled" };
            if (!allowed.Contains(dto.Status))
                return BadRequest("Invalid status. Allowed values: Processing, Completed, Cancelled.");

            order.Status = dto.Status;
            order.UpdatedAt = DateTime.UtcNow;

            if (dto.Status == "Completed")
            {
                order.PaymentStatus = "Unpaid";
            }

            await _context.SaveChangesAsync();

            // Notify customer — status changed
            var message = dto.Status == "Completed"
                ? $"Great news! Your order #{orderId} has been completed and is ready for pickup."
                : $"Your order #{orderId} has been cancelled.";

            var statusNotification = new Notification
            {
                CustomerId = order.CustomerId,
                Message = message
            };
            _context.Notifications.Add(statusNotification);
            await _context.SaveChangesAsync();

            // Send email — status changed
            var orderCustomer = await _context.Customers
                .FirstOrDefaultAsync(c => c.CustomerId == order.CustomerId);

            if (orderCustomer != null)
            {
                var emailSubject = dto.Status == "Completed"
                    ? "Your Laundry is Ready!"
                    : "Order Cancelled";

                var emailBody = dto.Status == "Completed"
                    ? $@"<h2>Your Laundry is Ready! 🎉</h2>
                        <p>Hi {orderCustomer.FullName},</p>
                        <p>Your order <strong>#{orderId}</strong> has been completed and is ready for pickup.</p>
                        <p>Thank you for choosing Laundry Services!</p>"
                    : $@"<h2>Order Cancelled</h2>
                        <p>Hi {orderCustomer.FullName},</p>
                        <p>Your order <strong>#{orderId}</strong> has been cancelled.</p>
                        <p>If you have any questions please contact us.</p>
                        <br/><p>Thank you for choosing Laundry Services!</p>";

                await _emailService.SendEmailAsync(
                    orderCustomer.Email!,
                    orderCustomer.FullName ?? "Customer",
                    emailSubject,
                    emailBody
                );
            }

            return Ok(new { order.OrderId, order.Status, order.UpdatedAt });
        }









    }

}