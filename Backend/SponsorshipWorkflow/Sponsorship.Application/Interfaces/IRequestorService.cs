using Sponsorship.Application.DTOs;
using Sponsorship.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sponsorship.Application.Interfaces
{
    public interface IRequestorService
    {
        Task<SponsorshipRequest> CreateRequestAsync(SponsorshipRequestDto dto);
        Task<SponsorshipRequest> UpdateRequestAsync(int requestId, SponsorshipRequestDto dto);
        Task<SponsorshipRequest> SubmitRequestAsync(int requestId, int userId);
        Task<SponsorshipRequest> CancelRequestAsync(int requestId, int userId);
        Task<List<SponsorshipRequest>> GetUserRequestsAsync(int userId);
        Task<SponsorshipRequestDto> GetRequestByIdAsync(int id);
    }
}
