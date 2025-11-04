using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZedCars.Net8.Models
{
    public class PurchaseAccessoryWithCar
    {
        [Key]
        public int PurchaseAccessoryId { get; set; }

        [Required]
        public int PurchaseId { get; set; }

        [Required]
        [StringLength(100)]
        public string AccessoryName { get; set; } = string.Empty;

        //Navigation Property
        public Purchase? Purchase { get; set; }
    }
}
