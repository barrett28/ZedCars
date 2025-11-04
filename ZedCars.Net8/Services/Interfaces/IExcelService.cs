using ZedCars.Net8.ViewModels.ReportsCont;

namespace ZedCars.Net8.Services.Interfaces
{
    public interface IExcelService
    {
        byte[] GenerateComprehensiveExcel(SalesReportViewModel model);
    }
}
