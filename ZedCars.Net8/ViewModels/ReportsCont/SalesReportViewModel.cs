using System.ComponentModel.DataAnnotations.Schema;
using ZedCars.Net8.Models;

namespace ZedCars.Net8.ViewModels.ReportsCont
{
    // Car charts
    public class SalesByBrandDto
    {
        public string Brand { get; set; } = string.Empty;
        public int UnitsSold { get; set; }
        public decimal TotalSales { get; set; }
        public int StockAvailable { get; set; }
    }

    public class MonthlySalesDto
    {
        public int Year { get; set; }
        public int Month { get; set; } // 1 to 12
        public int UnitsSold { get; set; }
        public decimal TotalSales { get; set; }
    }

    // Accessory charts
    public class AccessorySalesByCategory
    {
        public string Category { get; set; } = string.Empty;
        public int UnitsSold { get; set; }
        public decimal TotalSales { get; set; }
    }

    public class AccessoryMonthlySales
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public int UnitsSold { get; set; }
        public decimal TotalSales { get; set; }
    }

    // This class is used to combine DTO (Data Transferr objects)
    public class SalesReportViewModel
    {
        public List<SalesByBrandDto> SalesByBrand { get; set; } = new();
        public List<MonthlySalesDto> SalesByMonths { get; set; } = new();

        public List<AccessorySalesByCategory> AccessorySalesByCategories { get; set; } = new();
        public List<AccessoryMonthlySales> AccessoryMonthlySales { get; set; } = new();

        public decimal TotalSalesValue { get; set; }
        public int TotalUnitsSold { get; set; }

        public decimal AverageSalesValue { get; set; }

        // For displaying purchases table
        public List<Purchase>? Purchases { get; set; }
        public int PurchasesCurrentPage { get; set; } = 1;
        public int PurchasesTotalPages { get; set; }
        public int PurchasesTotalCount { get; set; }

        public List<AccessoryPurchaseOnly>? AccessoryPurchaseOnly { get; set; }
        public int AccessoryCurrentPage { get; set; } = 1;
        public int AccessoryTotalPages { get; set; }
        public int AccessoryTotalCount { get; set; }

        public decimal AccessoryTotalSales { get; set; }

        public decimal AccessoryAverageSales { get; set; }

        public int AccessoryCount { get; set; }

    }
}
