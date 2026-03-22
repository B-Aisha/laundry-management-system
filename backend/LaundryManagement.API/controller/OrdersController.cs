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

        public OrdersController(LaundryDbContext context)
        {
            _context = context;
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









    }

}