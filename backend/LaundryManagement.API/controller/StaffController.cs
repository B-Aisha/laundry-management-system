using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LaundryManagement.API.data;
using LaundryManagement.API.DTOs.Staff;

namespace LaundryManagement.API.Controllers
{
    [ApiController]
    [Route("api/staff")]
    //[Authorize]
    public class StaffController : ControllerBase
    {
        private readonly LaundryDbContext _context;

        public StaffController(LaundryDbContext context)
        {
            _context = context;
        }

        // GET api/staff/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetStaffById(int id)
        {
            var staff = await _context.Staffs
                .Where(s => s.StaffId == id)
                .Select(s => new StaffDto
                {
                    StaffId = s.StaffId,
                    FullName = s.FullName,
                    Email = s.Email,
                    Position = s.Position
                })
                .FirstOrDefaultAsync();

            if (staff == null)
                return NotFound("Staff member not found.");

            return Ok(staff);
        }


        [HttpGet]
        public async Task<IActionResult> GetAllStaff()
        {
            var staff = await _context.Staffs
                .Select(s => new
                {
                    s.StaffId,
                    s.FullName,
                    s.Email,
                    s.Position
                })
                .ToListAsync();

            return Ok(staff);
        }







    }
}