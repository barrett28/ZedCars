using System.ComponentModel.DataAnnotations;

namespace ZedCars.Net8.Models
{
    
    public class Accessory
    {
        public int? AccessoryId { get; set; }

        [Required]
        [StringLength(100)]
        public string? Name { get; set; }

        [StringLength(50)]
        public string Category { get; set; } = string.Empty;

        [Required]
        public decimal? Price { get; set; }

        public int? StockQuantity { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        [StringLength(50)]
        public string? PartNumber { get; set; }

        [StringLength(50)]
        public string? Manufacturer { get; set; }

        public DateTime? CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }

        [StringLength(50)]
        public string? CreatedBy { get; set; }

        [StringLength(50)]
        public string? ModifiedBy { get; set; }

        public bool IsActive { get; set; } 

        public Accessory()
        {
            CreatedDate = DateTime.Now;
            IsActive = true;
            StockQuantity = 0;
        }
    }
}
