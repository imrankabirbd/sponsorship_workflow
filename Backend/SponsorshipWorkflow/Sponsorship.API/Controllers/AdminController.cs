using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Sponsorship.Application.Interfaces;

namespace Sponsorship.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService) 
        {
            _adminService = adminService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var requests = await _adminService.GetRequestById(id);
            return Ok(requests);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllRequests()
        {
            var requests = await _adminService.GetAllRequests();
            return Ok(requests);
        }

        [HttpGet("{requestId}/history")]
        public async Task<IActionResult> GetAllRequestsHistory(int requestId)
        {
            var requests = await _adminService.GetRequestHistory(requestId);
            return Ok(requests);
        }
    }
}
