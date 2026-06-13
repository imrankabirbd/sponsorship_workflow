using Sponsorship.Domain;
using System.ComponentModel.DataAnnotations;

namespace Sponsorship.Application.DTOs
{
    public class SponsorshipRequestDto
    {
        public int Id { get; set; }
        public int RequestorId { get; set; }
        public string RequestorName { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public int SponsorshipTypeId { get; set; }
        public string SponsorshipTypeName { get; set; } = string.Empty;
        public string EventName { get; set; } = string.Empty;
        public DateTime EventDate { get; set; }
        public decimal RequestedAmount { get; set; }
        public string Justification { get; set; } = string.Empty;
        public string? ExpectedBenefit { get; set; }
        public string? Remarks { get; set; }
        public RequestStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? SubmittedAt { get; set; }
        public DateTime? ManagerApprovedAt { get; set; }
        public DateTime? FinanceApprovedAt { get; set; }
        public string? ManagerRemarks { get; set; }
        public string? FinanceRemarks { get; set; }

        public bool IsValidDate()
        {
            return EventDate.Kind == DateTimeKind.Utc;
        }
    }  
}