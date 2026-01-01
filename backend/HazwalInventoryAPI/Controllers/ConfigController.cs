// ===== Controllers/ConfigController.cs =====
using Microsoft.AspNetCore.Mvc;

namespace HazwalInventoryAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConfigController : ControllerBase
    {
        private readonly Microsoft.Extensions.Configuration.IConfiguration _configuration;

        public ConfigController(Microsoft.Extensions.Configuration.IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var allow = _configuration.GetValue<bool>("Delivery:AllowSameDayMultipleAssignments", false);
            return Ok(new { allowSameDayMultipleAssignments = allow });
        }
    }
}
