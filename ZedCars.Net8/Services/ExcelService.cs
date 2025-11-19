using System.IO;
using System.Linq;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using ZedCars.Net8.ViewModels.ReportsCont;
using ZedCars.Net8.Services.Interfaces;
using ZedCars.Net8.Models;

namespace ZedCars.Net8.Services
{
    public class ExcelService : IExcelService
    {
        public byte[] GenerateComprehensiveExcel(SalesReportViewModel model)
        {
            using var ms = new MemoryStream();
            using (var workbook = SpreadsheetDocument.Create(ms, SpreadsheetDocumentType.Workbook))
            {
                var wbPart = workbook.AddWorkbookPart();
                wbPart.Workbook = new Workbook();
                var sheets = wbPart.Workbook.AppendChild(new Sheets());

                // Summary Sheet
                CreateSummarySheet(wbPart, sheets, model, 1);
                
                // Car Sales by Brand Sheet
                CreateCarSalesByBrandSheet(wbPart, sheets, model, 2);
                
                // Car Purchase Details Sheet
                CreatePurchaseDetailsSheet(wbPart, sheets, model, 3);
                
                // Accessory Purchase Details Sheet
                CreateAccessoryPurchaseDetailsSheet(wbPart, sheets, model, 4);

                wbPart.Workbook.Save();
            }
            return ms.ToArray();
        }

        private void CreateSummarySheet(WorkbookPart wbPart, Sheets sheets, SalesReportViewModel model, uint sheetId)
        {
            var sheetPart = wbPart.AddNewPart<WorksheetPart>();
            var sheetData = new SheetData();
            
            sheetData.Append(CreateTextRow("ZEDCARS SALES REPORT SUMMARY"));
            sheetData.Append(CreateEmptyRow());
            
            // Car Sales Summary
            sheetData.Append(CreateTextRow("CAR SALES SUMMARY"));
            sheetData.Append(CreateTextRow($"Total Sales Value: ${model.TotalSalesValue:F2}"));
            sheetData.Append(CreateTextRow($"Total Units Sold: {model.TotalUnitsSold}"));
            sheetData.Append(CreateTextRow($"Average Sales Value: ${model.AverageSalesValue:F2}"));
            sheetData.Append(CreateEmptyRow());
            
            // Accessory Sales Summary
            sheetData.Append(CreateTextRow("ACCESSORY SALES SUMMARY"));
            sheetData.Append(CreateTextRow($"Total Sales Value: ${model.AccessoryTotalSales:F2}"));
            sheetData.Append(CreateTextRow($"Total Units Sold: {model.AccessoryCount}"));
            sheetData.Append(CreateTextRow($"Average Sales Value: ${model.AccessoryAverageSales:F2}"));
            
            sheetPart.Worksheet = new Worksheet(sheetData);
            sheets.Append(new Sheet() { Id = wbPart.GetIdOfPart(sheetPart), SheetId = sheetId, Name = "Summary" });
        }

        private void CreateCarSalesByBrandSheet(WorkbookPart wbPart, Sheets sheets, SalesReportViewModel model, uint sheetId)
        {
            var sheetPart = wbPart.AddNewPart<WorksheetPart>();
            var sheetData = new SheetData();
            
            var headerRow = new Row();
            headerRow.Append(CreateTextCell("Brand"), CreateTextCell("Units Sold"), CreateTextCell("Total Sales ($)"));
            sheetData.Append(headerRow);
            
            foreach (var item in model.SalesByBrand)
            {
                var row = new Row();
                row.Append(CreateTextCell(item.Brand), CreateNumberCell(item.UnitsSold.ToString()), CreateNumberCell(item.TotalSales.ToString("F2")));
                sheetData.Append(row);
            }
            
            sheetPart.Worksheet = new Worksheet(sheetData);
            sheets.Append(new Sheet() { Id = wbPart.GetIdOfPart(sheetPart), SheetId = sheetId, Name = "Car Sales by Brand" });
        }

        private void CreatePurchaseDetailsSheet(WorkbookPart wbPart, Sheets sheets, SalesReportViewModel model, uint sheetId)
        {
            var sheetPart = wbPart.AddNewPart<WorksheetPart>();
            var sheetData = new SheetData();
            
            var headerRow = new Row();
            headerRow.Append(CreateTextCell("Purchase ID"), CreateTextCell("Customer"), CreateTextCell("Vehicle"), CreateTextCell("Amount ($)"), CreateTextCell("Date"));
            sheetData.Append(headerRow);
            
            foreach (var purchase in model.Purchases)
            {
                var row = new Row();
                row.Append(
                    CreateNumberCell(purchase.PurchaseId.ToString()),
                    CreateTextCell($"{purchase.BuyerName}"),
                    CreateTextCell($"{purchase.Car?.Brand} {purchase.Car?.Model}"),
                    CreateNumberCell(purchase.PurchasePrice.ToString("F2")),
                    CreateTextCell(purchase.PurchaseDate.ToString("yyyy-MM-dd"))
                );
                sheetData.Append(row);
            }
            
            sheetPart.Worksheet = new Worksheet(sheetData);
            sheets.Append(new Sheet() { Id = wbPart.GetIdOfPart(sheetPart), SheetId = sheetId, Name = "Purchase Details" });
        }



        private void CreateAccessoryPurchaseDetailsSheet(WorkbookPart wbPart, Sheets sheets, SalesReportViewModel model, uint sheetId)
        {
            var sheetPart = wbPart.AddNewPart<WorksheetPart>();
            var sheetData = new SheetData();
            
            var headerRow = new Row();
            headerRow.Append(
                CreateTextCell("AccessoryPurchaseId"), 
                CreateTextCell("BuyerName"), 
                CreateTextCell("BuyerEmail"), 
                CreateTextCell("SelectedAccessoriesString"), 
                CreateTextCell("TotalPrice"), 
                CreateTextCell("PurchaseDate")
            );
            sheetData.Append(headerRow);
            
            foreach (var accessoryPurchase in model.AccessoryPurchaseOnly)
            {
                var row = new Row();
                row.Append(
                    CreateNumberCell(accessoryPurchase.AccessoryPurchaseId.ToString()),
                    CreateTextCell(accessoryPurchase.BuyerName ?? ""),
                    CreateTextCell(accessoryPurchase.BuyerEmail),
                    CreateTextCell(accessoryPurchase.SelectedAccessoriesString),
                    CreateNumberCell(accessoryPurchase.TotalPrice.ToString("F2")),
                    CreateTextCell(accessoryPurchase.PurchaseDate.ToString("yyyy-MM-dd HH:mm:ss"))
                );
                sheetData.Append(row);
            }
            
            sheetPart.Worksheet = new Worksheet(sheetData);
            sheets.Append(new Sheet() { Id = wbPart.GetIdOfPart(sheetPart), SheetId = sheetId, Name = "Accessory Purchase Details" });
        }

        private Cell CreateTextCell(string text) => new Cell { DataType = CellValues.String, CellValue = new CellValue(text) };
        private Cell CreateNumberCell(string value) => new Cell { DataType = CellValues.Number, CellValue = new CellValue(value) };
        private Row CreateTextRow(string text) { var row = new Row(); row.Append(CreateTextCell(text)); return row; }
        private Row CreateEmptyRow() => new Row();
    }
}
