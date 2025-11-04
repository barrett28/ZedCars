using ZedCars.Net8.Models;

namespace ZedCars.Net8.ViewModels.HomeCont
{
    public class MyPurchaseViewModel
    {
        public Car? Car{ get; set; }
        public Purchase? Purchase { get; set; }
        public TestDrive? TestDrive { get; set; }
        public AccessoryPurchaseOnly? AccessoryPurchaseOnly {  get; set; }
    }
}
