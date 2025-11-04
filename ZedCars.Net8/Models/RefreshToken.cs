using System.ComponentModel.DataAnnotations;

namespace ZedCars.Net8.Models
{
    public class RefreshToken
    {
        public int Id { get; set; }
        
        [Required]
        public string Token { get; set; } = string.Empty;
        
        public int AdminId { get; set; }
        public Admin Admin { get; set; } = null!;
        
        public DateTime ExpiryDate { get; set; }
        public bool IsRevoked { get; set; } = false;
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}
