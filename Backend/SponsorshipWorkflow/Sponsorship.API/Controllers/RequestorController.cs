using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Sponsorship.Application.DTOs;
using Sponsorship.Application.Interfaces;

namespace Sponsorship.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RequestorController : ControllerBase
    {
        private readonly IRequestorService _requestorService;

        public RequestorController(IRequestorService requestorService) 
        {
            _requestorService = requestorService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var requests = await _requestorService.GetRequestByIdAsync(id);
            return Ok(requests);
        }

        [HttpGet("{userId}/get-by-user")]
        public async Task<IActionResult> GetByUser(int userId)
        {
            var requests = await _requestorService.GetUserRequestsAsync(userId);
            return Ok(requests);
        }

        [HttpPost]
        public async Task<IActionResult> CreateRequest([FromBody] SponsorshipRequestDto dto)
        {
            var request = await _requestorService.CreateRequestAsync(dto);
            return Ok(new { id = request.Id, message = "Request created successfully" });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRequest(int id, [FromBody] SponsorshipRequestDto dto)
        {
            var request = await _requestorService.UpdateRequestAsync(id, dto);
            return Ok(new { id = request.Id, message = "Request created successfully" });
        }

        [HttpPut("submit")]
        public async Task<IActionResult> SubmitRequest([FromBody] SubmitRequestDto dto)
        {
            var request = await _requestorService.SubmitRequestAsync(dto.RequestId, dto.UserId);
            return Ok(new { status = request.Status.ToString(), message = "Request submitted" });
        }

        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> Cancle(int id)
        {
            var request = await _requestorService.CancelRequestAsync(id, 0);
            return Ok(new { status = request.Status.ToString(), message = "Request submitted" });
        }
    }
}
