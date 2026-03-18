using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LaundryManagement.API.data;
using LaundryManagement.API.DTOs.Customer;

namespace LaundryManagement.API.Controllers
{
    [ApiController]
    [Route("api/customers")]
    //[Authorize] // Requires a valid JWT token
    public class CustomerController : ControllerBase
    {
        private readonly LaundryDbContext _context;

        public CustomerController(LaundryDbContext context)
        {
            _context = context;
        }

        // GET api/customers/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCustomerById(int id)
        {
            var customer = await _context.Customers
                .Where(c => c.CustomerId == id)
                .Select(c => new CustomerDto
                {
                    CustomerId = c.CustomerId,
                    FullName = c.FullName,
                    Email = c.Email,
                    Phone = c.Phone,
                    Address = c.Address
                })
                .FirstOrDefaultAsync();

            if (customer == null)
                return NotFound("Customer not found.");

            return Ok(customer);
        }
    }
}