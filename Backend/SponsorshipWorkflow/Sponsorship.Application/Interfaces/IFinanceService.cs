using Sponsorship.Application.DTOs;
using Sponsorship.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sponsorship.Application.Interfaces
{
    public interface IFinanceService
    {
        Task<List<SponsorshipRequest>> GetPendingRequests();
        Task<SponsorshipRequest> Approve(int requestId, int financeId, string remarks);
        Task<SponsorshipRequest> Reject(int requestId, int financeId, string remarks);
        Task<SponsorshipRequestDto> GetRequestById(int id);
    }
}
