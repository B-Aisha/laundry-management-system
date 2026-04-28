using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using LaundryManagement.API.models;
using LaundryManagement.API.data;
using Microsoft.EntityFrameworkCore;

namespace LaundryManagement.API.Controllers
{
    [ApiController]
    [Route("api/admin/users")]
   //[Authorize(Roles = "Admin")]
    public class AdminUserController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
         private readonly LaundryDbContext _context;

        public AdminUserController(
            UserManager<ApplicationUser> userManager,
            LaundryDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        // GET: api/admin/users
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = _userManager.Users.ToList();

            var result = new List<object>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);

                result.Add(new
                {
                    user.Id,
                    user.FullName,
                    user.Email,
                    user.UserType,
                    Roles = roles,
                    user.IsActive
                });
            }

            return Ok(result);
        }

        // DELETE: api/admin/users/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound();

            await _userManager.DeleteAsync(user);
            return Ok("User deleted");
        }


         // PUT: api/admin/users/{id}/role
        [HttpPut("{id}/role")]
        public async Task<IActionResult> UpdateUserRole(string id, [FromBody] string role)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound();

            var currentRoles = await _userManager.GetRolesAsync(user);

            await _userManager.RemoveFromRolesAsync(user, currentRoles);
            await _userManager.AddToRoleAsync(user, role);

            user.UserType = role;
            await _userManager.UpdateAsync(user);

            // ✅ remove from previous role table
        var existingCustomer = await _context.Customers.FirstOrDefaultAsync(c => c.ApplicationUserId == id);
        if (existingCustomer != null)
            _context.Customers.Remove(existingCustomer);

        var existingStaff = await _context.Staffs.FirstOrDefaultAsync(s => s.ApplicationUserId == id);
        if (existingStaff != null)
            _context.Staffs.Remove(existingStaff);

        // ✅ add to new role table
        if (role == "Customer")
        {
            _context.Customers.Add(new Customer
            {
                ApplicationUserId = user.Id,
                Phone = "",
                FullName = user.FullName,
                Email = user.Email

            });
        }
        else if (role == "Staff")
        {
            _context.Staffs.Add(new Staff
            {
                ApplicationUserId = user.Id,
                Position = "General",
                FullName = user.FullName,
                Email = user.Email
            });
        }

        await _context.SaveChangesAsync();


            return Ok("Role updated");
        }

        // POST: api/admin/users/create-staff
        [HttpPost("create-staff")]
        public async Task<IActionResult> CreateStaff([FromBody] CreateStaffDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                FullName = model.FullName,
                UserType = "Staff",
                IsActive = true
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            await _userManager.AddToRoleAsync(user, "Staff");

            var staff = new Staff
        {
            ApplicationUserId = user.Id,
            Position = model.Position ?? "General",
            FullName = model.FullName,
            Email = model.Email

        };

        _context.Staffs.Add(staff);
        await _context.SaveChangesAsync();


            return Ok("Staff account created successfully");
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/toggle-active")]
        public async Task<IActionResult> ToggleActive(string id)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user == null)
                return NotFound();

            user.IsActive = !user.IsActive;

            await _userManager.UpdateAsync(user);

            return Ok(new { user.IsActive });
        }


            
    }
}
