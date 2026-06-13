using System.ComponentModel.DataAnnotations;

namespace Sponsorship.Domain.Entities
{
    public class SponsorshipType : BaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string TypeName { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [Range(0, 1000000)]
        public decimal? MaxAmount { get; set; }

        public int DisplayOrder { get; set; } = 0;

        // Navigation property
        public virtual ICollection<SponsorshipRequest>? Requests { get; set; }
    }
}