// ===== Controllers/ChemicalsController.cs =====
using HazwalInventoryAPI.Models;
using HazwalInventoryAPI.Models.DTOs;
using HazwalInventoryAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace HazwalInventoryAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChemicalsController : ControllerBase
    {
        private readonly IChemicalStockService _service;

        public ChemicalsController(IChemicalStockService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ChemicalStock>>> GetAll()
        {
            var chemicals = await _service.GetAllAsync();
            return Ok(chemicals);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ChemicalStock>> GetById(string id)
        {
            var chemical = await _service.GetByIdAsync(id);
            return Ok(chemical);
        }

        [HttpGet("low-stock")]
        public async Task<ActionResult<IEnumerable<ChemicalStock>>> GetLowStock()
        {
            var chemicals = await _service.GetLowStockAsync();
            return Ok(chemicals);
        }

        [HttpPost]
        public async Task<ActionResult<ChemicalStock>> Create([FromBody] CreateChemicalDto dto)
        {
            var chemical = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = chemical.Id }, chemical);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ChemicalStock>> Update(string id, [FromBody] UpdateChemicalDto dto)
        {
            var chemical = await _service.UpdateAsync(id, dto);
            return Ok(chemical);
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
