using ZedCars.Net8.ViewModels;
using ZedCars.Net8.ViewModels.ReportsCont;

namespace ZedCars.Net8.Services
{
    public interface IPdfService
    {
        byte[] GenerateSalesReportPdf(SalesReportViewModel model);
    }
}
