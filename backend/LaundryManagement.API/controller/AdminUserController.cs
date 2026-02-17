using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using LaundryManagement.API.models;

namespace LaundryManagement.API.controllers
{
    [ApiController]
    [Route("api/admin/users")]
   //[Authorize(Roles = "Admin")]
    public class AdminUserController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public AdminUserController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
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
                    Roles = roles
                });
            }

            return Ok(result);
        }

       

        
    }
}
