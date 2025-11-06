using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ZedCars.Net8.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using ZedCars.Net8.Services.Interfaces;
using ZedCars.Net8.ViewModels.ReportsCont;

namespace ZedCars.Net8.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "SuperAdmin,Manager")]
    public class ReportsController : ControllerBase
    {
        private readonly IPurchaseRepository _purchaseRepo;
        private readonly IPdfService _pdfService;
        private readonly IExcelService _excelService;
        private const int PageSize = 7;

        public ReportsController(IPurchaseRepository purchaseRepo, IPdfService pdfService, IExcelService excelService)
        {
            _purchaseRepo = purchaseRepo;
            _pdfService = pdfService;
            _excelService = excelService;
        }

        [HttpGet("sales")]
        public async Task<IActionResult> SalesReport(int purchasePage = 1, int accessoryPage = 1)
        {
            var allPurchases = await _purchaseRepo.GetAllPurchasesAsync();
            var allAccessories = await _purchaseRepo.GetAllAccessoriesAsync();

            var purchasesTotalCount = allPurchases.Count;
            var accessoryTotalCount = allAccessories.Count;

            var purchasesTotalPages = (int)Math.Ceiling((double)purchasesTotalCount / PageSize);
            var accessoryTotalPages = (int)Math.Ceiling((double)accessoryTotalCount / PageSize);

            var paginatedPurchases = allPurchases
                .Skip((purchasePage - 1) * PageSize)
                .Take(PageSize)
                .ToList();

            var paginatedAccessories = allAccessories
                .Skip((accessoryPage - 1) * PageSize)
                .Take(PageSize)
                .ToList();

            var model = new SalesReportViewModel
            {
                SalesByBrand = await _purchaseRepo.GetSalesByBrandAsync() ?? new List<SalesByBrandDto>(),
                SalesByMonths = await _purchaseRepo.GetMonthlySalesTrendAsync() ?? new List<MonthlySalesDto>(),
                TotalSalesValue = await _purchaseRepo.GetTotalSalesAsync(),
                TotalUnitsSold = await _purchaseRepo.GetUnitsSoldAsync(),
                AverageSalesValue = await _purchaseRepo.GetAverageSalesAsync(),
                Purchases = paginatedPurchases,
                PurchasesCurrentPage = purchasePage,
                PurchasesTotalPages = purchasesTotalPages,
                PurchasesTotalCount = purchasesTotalCount,
                AccessoryPurchaseOnly = paginatedAccessories,
                AccessoryCurrentPage = accessoryPage,
                AccessoryTotalPages = accessoryTotalPages,
                AccessoryTotalCount = accessoryTotalCount,
                AccessoryTotalSales = await _purchaseRepo.GetAccessorySalesAsync(),
                AccessoryCount = await _purchaseRepo.GetAccessoryCountAsync(),
                AccessoryAverageSales = await _purchaseRepo.GetAccessoryAverageSalesAsync(),
                AccessorySalesByCategories = await _purchaseRepo.GetAccessorySalesByCategoriesAsync() ?? new List<AccessorySalesByCategory>(),
                AccessoryMonthlySales = await _purchaseRepo.GetAccessoryMonthlySalesTrendAsync() ?? new List<AccessoryMonthlySales>()
            };

            return Ok(model);
        }

        [HttpGet("sales/pdf")]
        public async Task<IActionResult> DownloadSalesReportPdf()
        {
            var model = await GetSalesReportModel();
            var pdfBytes = _pdfService.GenerateSalesReportPdf(model);
            
            var fileName = $"ZedCars_Sales_Report_{DateTime.Now:yyyy-MM-dd_HH-mm}.pdf";
            return File(pdfBytes, "application/pdf", fileName);
        }
        
        [HttpGet("sales/pdfExcelJson")]
        public async Task<IActionResult> GetSalesReportJson()
        {
            var model = await GetSalesReportModel();

            if (model == null)
                return NotFound(new { message = "Sales report data not found." });

            return Ok(model); // returns JSON automatically
        }


        [HttpPost("sales/excel")]
        public async Task<IActionResult> DownloadExcel()
        {
            var model = await GetSalesReportModel();
            var excelBytes = _excelService.GenerateComprehensiveExcel(model);
            var fileName = $"ZedCars_Sales_Report_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx";

            return File(excelBytes,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                fileName);
        }

        private async Task<SalesReportViewModel> GetSalesReportModel()
        {
            var allPurchases = await _purchaseRepo.GetAllPurchasesAsync();
            var allAccessories = await _purchaseRepo.GetAllAccessoriesAsync();

            return new SalesReportViewModel
            {
                SalesByBrand = await _purchaseRepo.GetSalesByBrandAsync() ?? new List<SalesByBrandDto>(),
                SalesByMonths = await _purchaseRepo.GetMonthlySalesTrendAsync() ?? new List<MonthlySalesDto>(),
                TotalSalesValue = await _purchaseRepo.GetTotalSalesAsync(),
                TotalUnitsSold = await _purchaseRepo.GetUnitsSoldAsync(),
                AverageSalesValue = await _purchaseRepo.GetAverageSalesAsync(),
                Purchases = allPurchases,
                AccessoryPurchaseOnly = allAccessories,
                AccessoryTotalSales = await _purchaseRepo.GetAccessorySalesAsync(),
                AccessoryCount = await _purchaseRepo.GetAccessoryCountAsync(),
                AccessoryAverageSales = await _purchaseRepo.GetAccessoryAverageSalesAsync(),
                AccessorySalesByCategories = await _purchaseRepo.GetAccessorySalesByCategoriesAsync() ?? new List<AccessorySalesByCategory>(),
                AccessoryMonthlySales = await _purchaseRepo.GetAccessoryMonthlySalesTrendAsync() ?? new List<AccessoryMonthlySales>()
            };
        }
    }
}
