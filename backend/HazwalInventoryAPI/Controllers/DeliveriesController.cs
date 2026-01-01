// ===== Controllers/DeliveriesController.cs =====
using HazwalInventoryAPI.Models;
using HazwalInventoryAPI.Models.DTOs;
using HazwalInventoryAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace HazwalInventoryAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DeliveriesController : ControllerBase
    {
        private readonly IDeliveryService _service;

        public DeliveriesController(IDeliveryService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Delivery>>> GetAll()
        {
            var deliveries = await _service.GetAllAsync();
            return Ok(deliveries);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Delivery>> GetById(string id)
        {
            var delivery = await _service.GetByIdAsync(id);
            return Ok(delivery);
        }

        [HttpGet("date-range")]
        public async Task<ActionResult<IEnumerable<Delivery>>> GetByDateRange(
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            var deliveries = await _service.GetByDateRangeAsync(startDate, endDate);
            return Ok(deliveries);
        }

        [HttpPost]
        public async Task<ActionResult<Delivery>> Create([FromBody] CreateDeliveryDto dto)
        {
            var delivery = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = delivery.Id }, delivery);
        }

        [HttpPatch("{id}/status")]
        public async Task<ActionResult<Delivery>> UpdateStatus(string id, [FromBody] UpdateDeliveryStatusDto dto)
        {
            var delivery = await _service.UpdateStatusAsync(id, dto);
            return Ok(delivery);
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