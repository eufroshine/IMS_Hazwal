// ===== Controllers/ReportsController.cs =====
using HazwalInventoryAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace HazwalInventoryAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly IChemicalStockService _chemicalService;
        private readonly IDeliveryService _deliveryService;
        private readonly ITruckService _truckService;
        private readonly IPdfReportService _pdfService;

        public ReportsController(
            IChemicalStockService chemicalService,
            IDeliveryService deliveryService,
            ITruckService truckService,
            IPdfReportService pdfService)
        {
            _chemicalService = chemicalService;
            _deliveryService = deliveryService;
            _truckService = truckService;
            _pdfService = pdfService;
        }

        [HttpGet("chemicals/pdf")]
        public async Task<IActionResult> GenerateChemicalReportPdf()
        {
            var chemicals = await _chemicalService.GetAllAsync();
            var pdfBytes = await _pdfService.GenerateChemicalStockReportAsync(chemicals);
            return File(pdfBytes, "application/pdf", $"Laporan-Stok-Kimia-{DateTime.Now:yyyyMMdd}.pdf");
        }

        [HttpGet("deliveries/pdf")]
        public async Task<IActionResult> GenerateDeliveryReportPdf()
        {
            var deliveries = await _deliveryService.GetAllAsync();
            var pdfBytes = await _pdfService.GenerateDeliveryReportAsync(deliveries);
            return File(pdfBytes, "application/pdf", $"Laporan-Pengiriman-{DateTime.Now:yyyyMMdd}.pdf");
        }

        [HttpGet("trucks/pdf")]
        public async Task<IActionResult> GenerateTruckReportPdf()
        {
            var trucks = await _truckService.GetAllAsync();
            var pdfBytes = await _pdfService.GenerateTruckStatusReportAsync(trucks);
            return File(pdfBytes, "application/pdf", $"Laporan-Status-Kendaraan-{DateTime.Now:yyyyMMdd}.pdf");
        }
    }
}