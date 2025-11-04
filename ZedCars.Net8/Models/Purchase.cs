using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZedCars.Net8.Models
{
    public class Purchase
    {
        [Key] // Primary key
        public int PurchaseId { get; set; }

        [Required]
        [ForeignKey("Car")]
        public int CarId { get; set; }

        [Required]
        [StringLength(100)]
        public string BuyerName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string BuyerEmail { get; set; } = string.Empty;

        [Required]
        [Range(1, 10, ErrorMessage = "You must purchase at least 1 car")]
        public int PurchaseQuantity { get; set; } = 1;

        [Column(TypeName ="decimal(18,2)")] // Total 18 digits and 2 after decimal point
        public decimal PurchasePrice { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime PurchaseDate { get; set; } = DateTime.Now;

        // Store selected accessories as comma-separated string
        [StringLength(1000)]
        public string? SelectedAccessoriesString { get; set; }

        // Navigation property
        public Car? Car { get; set; }

        // Helper property to work with list
        [NotMapped]
        public List<string> SelectedAccessories 
        { 
            get => string.IsNullOrEmpty(SelectedAccessoriesString) 
                ? new List<string>() 
                : SelectedAccessoriesString.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList();
            set => SelectedAccessoriesString = value?.Any() == true ? string.Join(",", value) : null;
        }
    }
}
