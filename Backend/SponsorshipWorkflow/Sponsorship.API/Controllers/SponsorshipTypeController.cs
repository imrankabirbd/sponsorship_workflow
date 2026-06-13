using Microsoft.AspNetCore.Mvc;
using Sponsorship.Application.Interfaces;
using Sponsorship.Domain.Entities;

namespace Sponsorship.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SponsorshipTypeController : ControllerBase
    {
        private readonly ISponsorshipTypeService _service;

        public SponsorshipTypeController(ISponsorshipTypeService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var result = await _service.GetByIdAsync(id);

            if (result == null)
                return NotFound();

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Add(SponsorshipType model)
        {
            var result = await _service.AddAsync(model);

            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, SponsorshipType model)
        {
            var result = await _service.UpdateAsync(id, model);

            if (result == null)
                return NotFound();

            return Ok(result);
        }
    }
}
