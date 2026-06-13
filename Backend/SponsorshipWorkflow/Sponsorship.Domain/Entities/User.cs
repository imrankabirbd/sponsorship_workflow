using System.ComponentModel.DataAnnotations;


namespace Sponsorship.Domain.Entities
{
    public class User : BaseEntity
    {
        [Required]
        [MaxLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [EmailAddress]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Department { get; set; } = string.Empty;

        [Required]
        public UserRole Role { get; set; }

        public DateTime? LastLoginAt { get; set; }

        // Navigation properties
        public virtual ICollection<SponsorshipRequest> Requests { get; set; } = new List<SponsorshipRequest>();

        public virtual ICollection<WorkflowHistory> WorkflowActions { get; set; } = new List<WorkflowHistory>();
    }
}