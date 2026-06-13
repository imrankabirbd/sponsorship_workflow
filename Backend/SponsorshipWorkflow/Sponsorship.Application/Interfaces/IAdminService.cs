using Sponsorship.Application.DTOs;
using Sponsorship.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sponsorship.Application.Interfaces
{
    public interface IAdminService
    {
        Task<List<SponsorshipRequestDto>> GetAllRequests();
        Task<SponsorshipRequestDto> GetRequestById(int id);
        Task<List<WorkflowHistoryDto>> GetRequestHistory(int requestId);
    }
}
