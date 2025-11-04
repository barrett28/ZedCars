using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZedCars.Net8.Models
{
    public class AccessoryPurchaseOnly
    {
        [Key]
        public int AccessoryPurchaseId { get; set; }

        [Required]
        [StringLength(100)]
        public string BuyerName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string BuyerEmail { get; set; } = string.Empty;

        // Store selected accessories as comma-separated string
        [Required]
        [StringLength(1000)]
        public string SelectedAccessoriesString { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalPrice { get; set; }

        public DateTime PurchaseDate { get; set; } = DateTime.Now;

        // Helper property to work with list
        [NotMapped]
        public List<string> SelectedAccessories 
        { 
            get => string.IsNullOrEmpty(SelectedAccessoriesString) 
                ? new List<string>() 
                : SelectedAccessoriesString.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList();
            set => SelectedAccessoriesString = value?.Any() == true ? string.Join(",", value) : string.Empty;
        }
    }
}
