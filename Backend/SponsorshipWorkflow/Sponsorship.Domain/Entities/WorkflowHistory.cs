using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Sponsorship.Domain.Entities
{
    public class WorkflowHistory : BaseEntity
    {
        [Required]
        public int RequestId { get; set; }

        [ForeignKey("RequestId")]
        public virtual SponsorshipRequest? Request { get; set; }

        [Required]
        [MaxLength(50)]
        public string Action { get; set; } = string.Empty; // SUBMIT, APPROVE, REJECT, CANCEL

        [Required]
        public int ActorUserId { get; set; }

        [ForeignKey("ActorUserId")]
        public virtual User? Actor { get; set; }

        [MaxLength(500)]
        public string? Remarks { get; set; }

        [Required]
        public RequestStatus OldStatus { get; set; }

        [Required]
        public RequestStatus NewStatus { get; set; }

        [MaxLength(50)]
        public string? IpAddress { get; set; }

        [MaxLength(500)]
        public string? UserAgent { get; set; }
    }
}