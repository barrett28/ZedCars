using System.ComponentModel.DataAnnotations;

namespace ZedCars.Net8.Models
{
    public class UserActivity
    {
        [Key]
        public int ActivityId { get; set; }
        [Required]
        [StringLength(50)]
        public string Username { get; set; } = string.Empty;
        public string ActivityType { get; set; } = string.Empty;
        [StringLength(200)]
        public string Description { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string? UserAgent { get; set; }
        public DateTime ActivityDate { get; set; } = DateTime.Now;

        [StringLength(50)]
        public string? Status { get; set; }

    }
}
