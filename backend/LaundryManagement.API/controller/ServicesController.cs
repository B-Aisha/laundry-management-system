using LaundryManagement.API.data;
using LaundryManagement.API.models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LaundryManagement.API.DTOs;

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

        // GET api/services/all  (admin - includes inactive)
        [HttpGet("all")]
        public async Task<IActionResult> GetAllServices()
        {
            var services = await _context.Services
                .Select(s => new
                {
                    s.ServiceId,
                    s.Name,
                    s.Description,
                    s.PricePerUnit,
                    s.Unit,
                    s.IsActive
                })
                .ToListAsync();

            return Ok(services);
        }

        // POST api/services
        [HttpPost]
        public async Task<IActionResult> CreateService([FromBody] ServiceDto dto)
        {
            var service = new Service
            {
                Name = dto.Name,
                Description = dto.Description,
                PricePerUnit = dto.PricePerUnit,
                Unit = dto.Unit,
                IsActive = true
            };

            _context.Services.Add(service);
            await _context.SaveChangesAsync();

            return Ok(service);
        }

        // PUT api/services/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateService(int id, [FromBody] ServiceDto dto)
        {
            var service = await _context.Services.FindAsync(id);
            if (service == null) return NotFound("Service not found.");

            service.Name = dto.Name;
            service.Description = dto.Description;
            service.PricePerUnit = dto.PricePerUnit;
            service.Unit = dto.Unit;

            await _context.SaveChangesAsync();
            return Ok(service);
        }

        // PUT api/services/{id}/toggle
        [HttpPut("{id}/toggle")]
        public async Task<IActionResult> ToggleService(int id)
        {
            var service = await _context.Services.FindAsync(id);
            if (service == null) return NotFound("Service not found.");

            service.IsActive = !service.IsActive;
            await _context.SaveChangesAsync();

            return Ok(new { service.ServiceId, service.Name, service.IsActive });
        }
    }
}