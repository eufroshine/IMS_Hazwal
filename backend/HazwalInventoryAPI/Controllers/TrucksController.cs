// ===== Controllers/TrucksController.cs =====
using HazwalInventoryAPI.Models;
using HazwalInventoryAPI.Models.DTOs;
using HazwalInventoryAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace HazwalInventoryAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TrucksController : ControllerBase
    {
        private readonly ITruckService _service;

        public TrucksController(ITruckService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Truck>>> GetAll()
        {
            var trucks = await _service.GetAllAsync();
            return Ok(trucks);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Truck>> GetById(string id)
        {
            var truck = await _service.GetByIdAsync(id);
            return Ok(truck);
        }

        [HttpGet("available")]
        public async Task<ActionResult<IEnumerable<Truck>>> GetAvailable()
        {
            var trucks = await _service.GetAvailableTrucksAsync();
            return Ok(trucks);
        }

        [HttpPost]
        public async Task<ActionResult<Truck>> Create([FromBody] CreateTruckDto dto)
        {
            var truck = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = truck.Id }, truck);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Truck>> Update(string id, [FromBody] CreateTruckDto dto)
        {
            var truck = await _service.UpdateAsync(id, dto);
            return Ok(truck);
        }

        [HttpPatch("{id}/status")]
        public async Task<ActionResult<Truck>> UpdateStatus(string id, [FromBody] dynamic request)
        {
            string status = request.status;
            var truck = await _service.UpdateStatusAsync(id, status);
            return Ok(truck);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var result = await _service.DeleteAsync(id);
            if (!result)
                return NotFound();
            return NoContent();
        }
    }
}