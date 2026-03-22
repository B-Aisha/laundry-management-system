using LaundryManagement.API.data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LaundryManagement.API.Controllers
{
    [ApiController]
    [Route("api/services")]
    public class ServicesController : ControllerBase
    {
        private readonly LaundryDbContext _context;

        public ServicesController(LaundryDbContext context)
        {
            _context = context;
        }

        // GET api/services
        [HttpGet]
        public async Task<IActionResult> GetActiveServices()
        {
            var services = await _context.Services
                .Where(s => s.IsActive)
                .Select(s => new
                {
                    s.ServiceId,
                    s.Name,
                    s.Description,
                    s.PricePerUnit,
                    s.Unit
                })
                .ToListAsync();

            return Ok(services);
        }
    }
}