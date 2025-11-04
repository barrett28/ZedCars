using System.ComponentModel.DataAnnotations;

namespace ZedCars.Net8.Models
{
    public class Admin
    {
        public int AdminId { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Username { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string Password { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string FullName { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;
        
        [StringLength(50)]
        public string? Department { get; set; }
        
        [Required]
        [StringLength(30)]
        public string Role { get; set; } = "Customer";
        
        [StringLength(20)]
        public string? PhoneNumber { get; set; }
        
        [StringLength(200)]
        public string? Address { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        public string? Permissions { get; set; }
        
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public DateTime ModifiedDate { get; set; } = DateTime.Now;
        public DateTime? LastLoginDate { get; set; }
        
        // Navigation property for JWT refresh tokens
        public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    }
}
