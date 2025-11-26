using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using ZedCars.Net8.Models;

namespace ZedCars.Net8.Services
{
    public class PdfReceiptService
    {
        public byte[] GeneratePurchaseReceipt(Purchase purchase)
        {
            QuestPDF.Settings.License = LicenseType.Community;

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(2, Unit.Centimetre);
                    page.DefaultTextStyle(x => x.FontSize(11));

                    page.Header().Element(ComposeHeader);
                    page.Content().Element(content => ComposeContent(content, purchase));
                    page.Footer().AlignCenter().Text(text =>
                    {
                        text.Span("Page ");
                        text.CurrentPageNumber();
                        text.Span(" of ");
                        text.TotalPages();
                    });
                });
            });

            return document.GeneratePdf();
        }

        void ComposeHeader(IContainer container)
        {
            container.Row(row =>
            {
                row.RelativeItem().Column(column =>
                {
                    column.Item().Text("ZedCars").FontSize(20).Bold().FontColor(Colors.Blue.Medium);
                    column.Item().Text("Vehicle Purchase Receipt").FontSize(14);
                });

                row.RelativeItem().AlignRight().Column(column =>
                {
                    column.Item().Text($"Date: {DateTime.Now:dd/MM/yyyy}").FontSize(10);
                    column.Item().Text($"Receipt #: {Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}").FontSize(10);
                });
            });
        }

        void ComposeContent(IContainer container, Purchase purchase)
        {
            container.PaddingVertical(20).Column(column =>
            {
                column.Spacing(10);

                // Customer Details
                column.Item().Text("Customer Information").Bold().FontSize(14);
                column.Item().PaddingLeft(10).Column(col =>
                {
                    col.Item().Text($"Name: {purchase.BuyerName}");
                    col.Item().Text($"Email: {purchase.BuyerEmail}");
                    col.Item().Text($"Purchase Date: {purchase.PurchaseDate:dd/MM/yyyy HH:mm}");
                });

                column.Item().PaddingTop(10).LineHorizontal(1);

                // Vehicle Details
                column.Item().PaddingTop(10).Text("Vehicle Information").Bold().FontSize(14);
                column.Item().PaddingLeft(10).Column(col =>
                {
                    col.Item().Text($"Brand: {purchase.Car?.Brand ?? "N/A"}");
                    col.Item().Text($"Model: {purchase.Car?.Model ?? "N/A"}");
                    col.Item().Text($"Year: {purchase.Car?.Year}");
                    col.Item().Text($"Color: {purchase.Car?.Color ?? "N/A"}");
                    col.Item().Text($"Mileage: {purchase.Car?.Mileage ?? 0} km");
                    col.Item().Text($"Transmission: {purchase.Car?.Transmission ?? "N/A"}");
                });

                // Accessories
                if (!string.IsNullOrEmpty(purchase.SelectedAccessoriesString))
                {
                    column.Item().PaddingTop(10).LineHorizontal(1);
                    column.Item().PaddingTop(10).Text("Accessories").Bold().FontSize(14);
                    column.Item().PaddingLeft(10).Column(col =>
                    {
                        var accessories = purchase.SelectedAccessories;
                        foreach (var accessory in accessories)
                        {
                            col.Item().Text($"• {accessory}");
                        }
                    });
                }

                column.Item().PaddingTop(10).LineHorizontal(1);

                // Pricing
                column.Item().PaddingTop(10).Text("Pricing Details").Bold().FontSize(14);
                column.Item().PaddingLeft(10).Column(col =>
                {
                    col.Item().Text($"Unit Price: ${purchase.PurchasePrice:N2}");
                    col.Item().Text($"Quantity: {purchase.PurchaseQuantity}");
                    col.Item().PaddingTop(5).Text($"Total Amount: ${purchase.PurchasePrice * purchase.PurchaseQuantity:N2}")
                        .Bold().FontSize(16).FontColor(Colors.Green.Darken2);
                });

                column.Item().PaddingTop(20).LineHorizontal(1);
                column.Item().PaddingTop(10).AlignCenter().Text("Thank you for your purchase!")
                    .FontSize(12).Italic();
            });
        }
    }
}
