using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using ZedCars.Net8.ViewModels.ReportsCont;

namespace ZedCars.Net8.Services
{
    public class PdfService : IPdfService
    {
        public byte[] GenerateSalesReportPdf(SalesReportViewModel model)
        {
            QuestPDF.Settings.License = LicenseType.Community;
            
            return Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(2, Unit.Centimetre);
                    page.DefaultTextStyle(x => x.FontSize(10));

                    page.Header().Element(ComposeHeader);
                    page.Content().Element(content => ComposeContent(content, model));
                    page.Footer().AlignCenter().Text(x =>
                    {
                        x.CurrentPageNumber();
                        x.Span(" / ");
                        x.TotalPages();
                    });
                });
            }).GeneratePdf();
        }

        void ComposeHeader(IContainer container)
        {
            container.Row(row =>
            {
                row.RelativeItem().Column(column =>
                {
                    column.Item().Text("ZedCars Sales Report").FontSize(20).SemiBold().FontColor(Colors.Blue.Medium);
                    column.Item().Text($"Generated on: {DateTime.Now:yyyy-MM-dd HH:mm}").FontSize(9).FontColor(Colors.Grey.Medium);
                });
            });
        }

        void ComposeContent(IContainer container, SalesReportViewModel model)
        {
            container.PaddingVertical(40).Column(column =>
            {
                column.Spacing(20);

                // Car Sales Summary
                column.Item().Element(content => ComposeCarSalesSummary(content, model));
                
                // Car Sales Charts Data
                column.Item().Element(content => ComposeCarSalesCharts(content, model));
                
                // Accessory Sales Summary
                column.Item().Element(content => ComposeAccessorySalesSummary(content, model));
                
                // Accessory Sales Charts Data
                column.Item().Element(content => ComposeAccessorySalesCharts(content, model));
            });
        }

        void ComposeCarSalesSummary(IContainer container, SalesReportViewModel model)
        {
            container.Column(column =>
            {
                column.Item().Text("Car Sales Summary").FontSize(16).SemiBold().FontColor(Colors.Blue.Medium);
                column.Item().PaddingTop(10);
                
                column.Item().Row(row =>
                {
                    row.RelativeItem().Border(1).Padding(10).Column(col =>
                    {
                        col.Item().Text("Total Sales").FontSize(12).SemiBold();
                        col.Item().Text($"${model.TotalSalesValue:F2}").FontSize(14).FontColor(Colors.Green.Medium);
                        col.Item().Text("Total sales of Cars").FontSize(8).FontColor(Colors.Grey.Medium);
                    });
                    
                    row.RelativeItem().Border(1).Padding(10).Column(col =>
                    {
                        col.Item().Text("Units Sold").FontSize(12).SemiBold();
                        col.Item().Text($"{model.TotalUnitsSold}").FontSize(14).FontColor(Colors.Green.Medium);
                        col.Item().Text("Number of cars sold").FontSize(8).FontColor(Colors.Grey.Medium);
                    });
                    
                    row.RelativeItem().Border(1).Padding(10).Column(col =>
                    {
                        col.Item().Text("Average Sales").FontSize(12).SemiBold();
                        col.Item().Text($"${model.AverageSalesValue:F2}").FontSize(14).FontColor(Colors.Red.Medium);
                        col.Item().Text("Average sale price of cars").FontSize(8).FontColor(Colors.Grey.Medium);
                    });
                });
            });
        }

        void ComposeCarSalesCharts(IContainer container, SalesReportViewModel model)
        {
            container.Column(column =>
            {
                column.Item().Text("Car Sales by Brand").FontSize(14).SemiBold().FontColor(Colors.Blue.Medium);
                column.Item().PaddingTop(5);
                
                column.Item().Table(table =>
                {
                    table.ColumnsDefinition(columns =>
                    {
                        columns.RelativeColumn();
                        columns.RelativeColumn();
                        columns.RelativeColumn();
                    });
                    
                    table.Header(header =>
                    {
                        header.Cell().Element(CellStyle).Text("Brand").SemiBold();
                        header.Cell().Element(CellStyle).Text("Units Sold").SemiBold();
                        header.Cell().Element(CellStyle).Text("Total Sales").SemiBold();
                    });
                    
                    foreach (var brand in model.SalesByBrand)
                    {
                        table.Cell().Element(CellStyle).Text(brand.Brand);
                        table.Cell().Element(CellStyle).Text($"{brand.UnitsSold}");
                        table.Cell().Element(CellStyle).Text($"${brand.TotalSales:F2}");
                    }
                });
                
                column.Item().PaddingTop(10);
                column.Item().Text("Monthly Sales Trend").FontSize(14).SemiBold().FontColor(Colors.Blue.Medium);
                column.Item().PaddingTop(5);
                
                column.Item().Table(table =>
                {
                    table.ColumnsDefinition(columns =>
                    {
                        columns.RelativeColumn();
                        columns.RelativeColumn();
                        columns.RelativeColumn();
                    });
                    
                    table.Header(header =>
                    {
                        header.Cell().Element(CellStyle).Text("Month").SemiBold();
                        header.Cell().Element(CellStyle).Text("Units Sold").SemiBold();
                        header.Cell().Element(CellStyle).Text("Total Sales").SemiBold();
                    });
                    
                    foreach (var month in model.SalesByMonths)
                    {
                        table.Cell().Element(CellStyle).Text($"{new DateTime(month.Year, month.Month, 1):MMM yyyy}");
                        table.Cell().Element(CellStyle).Text($"{month.UnitsSold}");
                        table.Cell().Element(CellStyle).Text($"${month.TotalSales:F2}");
                    }
                });
            });
        }

        void ComposeAccessorySalesSummary(IContainer container, SalesReportViewModel model)
        {
            container.Column(column =>
            {
                column.Item().Text("Accessory Sales Summary").FontSize(16).SemiBold().FontColor(Colors.Blue.Medium);
                column.Item().PaddingTop(10);
                
                column.Item().Row(row =>
                {
                    row.RelativeItem().Border(1).Padding(10).Column(col =>
                    {
                        col.Item().Text("Total Accessory Sales").FontSize(12).SemiBold();
                        col.Item().Text($"${model.AccessoryTotalSales:F2}").FontSize(14).FontColor(Colors.Green.Medium);
                        col.Item().Text("Total sales of Accessories").FontSize(8).FontColor(Colors.Grey.Medium);
                    });
                    
                    row.RelativeItem().Border(1).Padding(10).Column(col =>
                    {
                        col.Item().Text("Units Sold").FontSize(12).SemiBold();
                        col.Item().Text($"{model.AccessoryCount}").FontSize(14).FontColor(Colors.Green.Medium);
                        col.Item().Text("Number of accessories sold").FontSize(8).FontColor(Colors.Grey.Medium);
                    });
                    
                    row.RelativeItem().Border(1).Padding(10).Column(col =>
                    {
                        col.Item().Text("Average Sales").FontSize(12).SemiBold();
                        col.Item().Text($"${model.AccessoryAverageSales:F2}").FontSize(14).FontColor(Colors.Red.Medium);
                        col.Item().Text("Average sale price of accessories").FontSize(8).FontColor(Colors.Grey.Medium);
                    });
                });
            });
        }

        void ComposeAccessorySalesCharts(IContainer container, SalesReportViewModel model)
        {
            container.Column(column =>
            {
                column.Item().Text("Accessory Sales by Category").FontSize(14).SemiBold().FontColor(Colors.Blue.Medium);
                column.Item().PaddingTop(5);
                
                column.Item().Table(table =>
                {
                    table.ColumnsDefinition(columns =>
                    {
                        columns.RelativeColumn();
                        columns.RelativeColumn();
                        columns.RelativeColumn();
                    });
                    
                    table.Header(header =>
                    {
                        header.Cell().Element(CellStyle).Text("Category").SemiBold();
                        header.Cell().Element(CellStyle).Text("Units Sold").SemiBold();
                        header.Cell().Element(CellStyle).Text("Total Sales").SemiBold();
                    });
                    
                    foreach (var category in model.AccessorySalesByCategories)
                    {
                        table.Cell().Element(CellStyle).Text(category.Category);
                        table.Cell().Element(CellStyle).Text($"{category.UnitsSold}");
                        table.Cell().Element(CellStyle).Text($"${category.TotalSales:F2}");
                    }
                });
                
                column.Item().PaddingTop(10);
                column.Item().Text("Accessory Monthly Sales Trend").FontSize(14).SemiBold().FontColor(Colors.Blue.Medium);
                column.Item().PaddingTop(5);
                
                column.Item().Table(table =>
                {
                    table.ColumnsDefinition(columns =>
                    {
                        columns.RelativeColumn();
                        columns.RelativeColumn();
                        columns.RelativeColumn();
                    });
                    
                    table.Header(header =>
                    {
                        header.Cell().Element(CellStyle).Text("Month").SemiBold();
                        header.Cell().Element(CellStyle).Text("Units Sold").SemiBold();
                        header.Cell().Element(CellStyle).Text("Total Sales").SemiBold();
                    });
                    
                    foreach (var month in model.AccessoryMonthlySales)
                    {
                        table.Cell().Element(CellStyle).Text($"{new DateTime(month.Year, month.Month, 1):MMM yyyy}");
                        table.Cell().Element(CellStyle).Text($"{month.UnitsSold}");
                        table.Cell().Element(CellStyle).Text($"${month.TotalSales:F2}");
                    }
                });
            });
        }

        static IContainer CellStyle(IContainer container)
        {
            return container.Border(1).BorderColor(Colors.Grey.Lighten2).Padding(5);
        }
    }
}
