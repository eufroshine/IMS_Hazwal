using HazwalInventoryAPI.Models;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace HazwalInventoryAPI.Services
{
    public class PdfReportService : IPdfReportService
    {
        public PdfReportService()
        {
            QuestPDF.Settings.License = LicenseType.Community;
        }

        public Task<byte[]> GenerateChemicalStockReportAsync(List<ChemicalStock> chemicals)
        {
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4.Landscape());
                    page.Margin(30);
                    page.DefaultTextStyle(x => x.FontSize(10));

                    page.Header().Column(col =>
                    {
                        col.Item().AlignCenter().Text("PT. HAZWAL PERDANA MANDIRI").Bold().FontSize(14);
                        col.Item().AlignCenter().Text("LAPORAN STOK BAHAN KIMIA").Bold().FontSize(16);
                        col.Item().AlignRight().Text($"Tanggal: {DateTime.Now:dd/MM/yyyy HH:mm}").FontSize(9);
                        col.Item().PaddingVertical(10).LineHorizontal(1);
                    });

                    page.Content().Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.ConstantColumn(25);
                            columns.RelativeColumn(2);
                            columns.RelativeColumn(1);
                            columns.ConstantColumn(50);
                            columns.ConstantColumn(50);
                            columns.RelativeColumn(1);
                            columns.RelativeColumn(1.5f);
                            columns.RelativeColumn(1);
                        });

                        table.Header(header =>
                        {
                            header.Cell().Background(Colors.Grey.Lighten2).Padding(5).Text("No").Bold();
                            header.Cell().Background(Colors.Grey.Lighten2).Padding(5).Text("Nama Bahan").Bold();
                            header.Cell().Background(Colors.Grey.Lighten2).Padding(5).Text("Formula").Bold();
                            header.Cell().Background(Colors.Grey.Lighten2).Padding(5).Text("Jumlah").Bold();
                            header.Cell().Background(Colors.Grey.Lighten2).Padding(5).Text("Satuan").Bold();
                            header.Cell().Background(Colors.Grey.Lighten2).Padding(5).Text("Harga").Bold();
                            header.Cell().Background(Colors.Grey.Lighten2).Padding(5).Text("Supplier").Bold();
                            header.Cell().Background(Colors.Grey.Lighten2).Padding(5).Text("Kategori").Bold();
                        });

                        var idx = 1;
                        foreach (var c in chemicals)
                        {
                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten1).Padding(4).Text(idx++.ToString());
                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten1).Padding(4).Text(c.Name ?? "-");
                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten1).Padding(4).Text(c.Formula ?? "-");
                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten1).Padding(4).AlignRight().Text(c.Quantity.ToString());
                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten1).Padding(4).Text(c.Unit ?? "-");
                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten1).Padding(4).AlignRight().Text($"Rp {c.Price:N0}");
                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten1).Padding(4).Text(c.Supplier ?? "-");
                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten1).Padding(4).Text(c.Category ?? "-");
                        }
                    });

                    page.Footer().AlignCenter().Text(t =>
                    {
                        t.Span("Halaman ");
                        t.CurrentPageNumber();
                        t.Span(" dari ");
                        t.TotalPages();
                    });
                });
            });

            return Task.FromResult(document.GeneratePdf());
        }

        public Task<byte[]> GenerateDeliveryReportAsync(List<Delivery> deliveries)
        {
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4.Landscape());
                    page.Margin(30);
                    page.DefaultTextStyle(x => x.FontSize(10));

                    page.Header().Column(col =>
                    {
                        col.Item().AlignCenter().Text("PT. HAZWAL PERDANA MANDIRI").Bold().FontSize(14);
                        col.Item().AlignCenter().Text("LAPORAN PENGIRIMAN").Bold().FontSize(16);
                        col.Item().AlignRight().Text($"Tanggal: {DateTime.Now:dd/MM/yyyy HH:mm}").FontSize(9);
                        col.Item().PaddingVertical(10).LineHorizontal(1);
                    });

                    page.Content().Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.ConstantColumn(25);
                            columns.RelativeColumn(1.2f);
                            columns.ConstantColumn(80);
                            columns.RelativeColumn(1.5f);
                            columns.ConstantColumn(70);
                            columns.RelativeColumn(1.2f);
                            columns.ConstantColumn(80);
                            columns.RelativeColumn(1.0f);
                            columns.ConstantColumn(70);
                        });

                        table.Header(header =>
                        {
                            header.Cell().Background(Colors.Grey.Lighten2).Padding(5).Text("No").Bold();
                            header.Cell().Background(Colors.Grey.Lighten2).Padding(5).Text("No. Pengiriman").Bold();
                            header.Cell().Background(Colors.Grey.Lighten2).Padding(5).Text("Tanggal").Bold();
                            header.Cell().Background(Colors.Grey.Lighten2).Padding(5).Text("Bahan Kimia").Bold();
                            header.Cell().Background(Colors.Grey.Lighten2).Padding(5).Text("Jumlah").Bold();
                            header.Cell().Background(Colors.Grey.Lighten2).Padding(5).Text("Tujuan").Bold();
                            header.Cell().Background(Colors.Grey.Lighten2).Padding(5).Text("Truk (No.)").Bold();
                            header.Cell().Background(Colors.Grey.Lighten2).Padding(5).Text("Driver").Bold();
                            header.Cell().Background(Colors.Grey.Lighten2).Padding(5).Text("Status").Bold();
                        });

                        var idx = 1;
                        foreach (var d in deliveries)
                        {
                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten1).Padding(4).Text(idx++.ToString());
                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten1).Padding(4).Text(d.DeliveryNumber ?? "-");
                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten1).Padding(4).Text(d.DeliveryDate.ToString("dd/MM/yyyy"));
                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten1).Padding(4).Text(d.ChemicalName ?? "-");
                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten1).Padding(4).AlignRight().Text($"{d.Quantity} {d.Unit}");
                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten1).Padding(4).Text(d.Destination ?? "-");

                            // Collect truck numbers and drivers from assignments (comma-separated if multiple)
                            var truckNumbers = d.TruckAssignments != null && d.TruckAssignments.Any()
                                ? string.Join(", ", d.TruckAssignments.Select(t => string.IsNullOrWhiteSpace(t.TruckNumber) ? "-" : t.TruckNumber))
                                : "-";

                            var drivers = d.TruckAssignments != null && d.TruckAssignments.Any()
                                ? string.Join(", ", d.TruckAssignments.Select(t => string.IsNullOrWhiteSpace(t.Driver) ? "-" : t.Driver))
                                : "-";

                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten1).Padding(4).Text(truckNumbers);
                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten1).Padding(4).Text(drivers);
                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten1).Padding(4).Text(d.Status ?? "-");
                        }
                    });

                    page.Footer().AlignCenter().Text(t =>
                    {
                        t.Span("Halaman ");
                        t.CurrentPageNumber();
                        t.Span(" dari ");
                        t.TotalPages();
                    });
                });
            });

            return Task.FromResult(document.GeneratePdf());
        }

        public Task<byte[]> GenerateTruckStatusReportAsync(List<Truck> trucks)
        {
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4.Landscape());
                    page.Margin(30);
                    page.DefaultTextStyle(x => x.FontSize(10));

                    page.Header().Column(col =>
                    {
                        col.Item().AlignCenter().Text("PT. HAZWAL PERDANA MANDIRI").Bold().FontSize(14);
                        col.Item().AlignCenter().Text("LAPORAN STATUS KENDARAAN").Bold().FontSize(16);
                        col.Item().AlignRight().Text($"Tanggal: {DateTime.Now:dd/MM/yyyy HH:mm}").FontSize(9);
                        col.Item().PaddingVertical(10).LineHorizontal(1);
                    });

                    page.Content().Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.ConstantColumn(25);
                            columns.RelativeColumn(1);
                            columns.ConstantColumn(80);
                            columns.RelativeColumn(1.2f);
                            columns.RelativeColumn(1);
                            columns.ConstantColumn(70);
                            columns.ConstantColumn(90);
                        });

                        table.Header(header =>
                        {
                            header.Cell().Background(Colors.Grey.Lighten2).Padding(5).Text("No").Bold();
                            header.Cell().Background(Colors.Grey.Lighten2).Padding(5).Text("No. Kendaraan").Bold();
                            header.Cell().Background(Colors.Grey.Lighten2).Padding(5).Text("Kapasitas").Bold();
                            header.Cell().Background(Colors.Grey.Lighten2).Padding(5).Text("Driver").Bold();
                            header.Cell().Background(Colors.Grey.Lighten2).Padding(5).Text("No. Telepon").Bold();
                            header.Cell().Background(Colors.Grey.Lighten2).Padding(5).Text("Status").Bold();
                            header.Cell().Background(Colors.Grey.Lighten2).Padding(5).Text("Maintenance").Bold();
                        });

                        var idx = 1;
                        foreach (var t in trucks)
                        {
                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten1).Padding(4).Text(idx++.ToString());
                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten1).Padding(4).Text(t.TruckNumber ?? "-");
                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten1).Padding(4).AlignRight().Text($"{t.Capacity} {t.CapacityUnit}");
                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten1).Padding(4).Text(t.Driver ?? "-");
                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten1).Padding(4).Text(t.DriverPhone ?? "-");
                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten1).Padding(4).Text(t.Status ?? "-");
                            table.Cell().BorderBottom(1).BorderColor(Colors.Grey.Lighten1).Padding(4).Text(t.NextMaintenanceDate.ToString("dd/MM/yyyy"));
                        }
                    });

                    page.Footer().AlignCenter().Text(t =>
                    {
                        t.Span("Halaman ");
                        t.CurrentPageNumber();
                        t.Span(" dari ");
                        t.TotalPages();
                    });
                });
            });

            return Task.FromResult(document.GeneratePdf());
        }
    }
}
