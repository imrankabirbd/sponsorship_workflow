using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Sponsorship.Application.DTOs;
using Sponsorship.Application.Interfaces;

namespace Sponsorship.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FinanceController : ControllerBase
    {
        private readonly IFinanceService _financeService;

        public FinanceController(IFinanceService financeService) 
        { 
            _financeService = financeService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var requests = await _financeService.GetRequestById(id);
            return Ok(requests);
        }

        [HttpGet("pending-finance")]
        public async Task<IActionResult> GetPendingFinanceRequests()
        {
            var requests = await _financeService.GetPendingRequests();
            return Ok(requests);
        }

        [HttpPost("approve")]
        public async Task<IActionResult> FinanceApprove([FromBody] ApprovalDto dto)
        {
            var request = await _financeService.Approve(dto.RequestId, dto.UserId, dto.Remarks);
            return Ok(new { status = request.Status.ToString(), message = "Request approved by Finance Admin" });
        }

        [HttpPost("reject")]
        public async Task<IActionResult> FinanceReject([FromBody] ApprovalDto dto)
        {
            var request = await _financeService.Reject(dto.RequestId, dto.UserId, dto.Remarks);
            return Ok(new { status = request.Status.ToString(), message = "Request Reject by Finance Admin" });
        }
    }
}
