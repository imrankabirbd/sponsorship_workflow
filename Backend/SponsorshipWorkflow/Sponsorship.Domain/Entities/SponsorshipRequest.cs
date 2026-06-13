using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Sponsorship.Domain.Entities
{
    public class SponsorshipRequest : BaseEntity
    {
        // Basic Information
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public int RequestorId { get; set; }

        [ForeignKey("RequestorId")]
        public virtual User? Requestor { get; set; }

        [Required]
        [MaxLength(50)]
        public string Department { get; set; } = string.Empty;

        [Required]
        public int SponsorshipTypeId { get; set; }

        [ForeignKey("SponsorshipTypeId")]
        public virtual SponsorshipType? SponsorshipType { get; set; }


        // Event Details
        [Required]
        [MaxLength(200)]
        public string EventName { get; set; } = string.Empty;

        [Required]
        public DateTime EventDate { get; set; }

        [Required]
        [Range(0, 1000000)]
        public decimal RequestedAmount { get; set; }

        // Justification
        [Required]
        [MinLength(10)]
        public string Justification { get; set; } = string.Empty;

        public string? ExpectedBenefit { get; set; }

        public string? Remarks { get; set; }

        public string? DocumentUrl { get; set; }

        // Workflow Status
        [Required]
        public RequestStatus Status { get; set; } = RequestStatus.Draft;

        // Audit Trail
        public DateTime? SubmittedAt { get; set; }

        public DateTime? ManagerApprovedAt { get; set; }

        public DateTime? FinanceApprovedAt { get; set; }

        public string? ManagerRemarks { get; set; }

        public string? FinanceRemarks { get; set; }

        // Navigation properties
        public virtual ICollection<WorkflowHistory> Histories { get; set; } = new List<WorkflowHistory>();
    }
}