using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Sponsorship.Application.DTOs;
using Sponsorship.Application.Interfaces;

namespace Sponsorship.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManagerController : ControllerBase
    {
        private readonly IManagerService _managerService;

        public ManagerController(IManagerService managerService) 
        {
            _managerService = managerService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var requests = await _managerService.GetRequestById(id);
            return Ok(requests);
        }

        [HttpGet("pending-manager")]
        public async Task<IActionResult> GetPendingManagerRequests()
        {
            var requests = await _managerService.GetPendingRequests();
            return Ok(requests);
        }

        [HttpPost("approve")]
        public async Task<IActionResult> Approve([FromBody] ApprovalDto dto)
        {
            var request = await _managerService.Approve(dto.RequestId, dto.UserId, dto.Remarks);
            return Ok(new { status = request.Status.ToString(), message = "Request approved by manager" });
        }

        [HttpPost("reject")]
        public async Task<IActionResult> Reject([FromBody] ApprovalDto dto)
        {
            var request = await _managerService.Reject(dto.RequestId, dto.UserId, dto.Remarks);
            return Ok(new { status = request.Status.ToString(), message = "Request Reject by manager" });
        }
    }
}
