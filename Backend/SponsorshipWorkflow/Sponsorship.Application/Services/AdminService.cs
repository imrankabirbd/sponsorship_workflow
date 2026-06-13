using Microsoft.EntityFrameworkCore;
using Sponsorship.Application.DTOs;
using Sponsorship.Application.Interfaces;
using Sponsorship.Domain.Entities;
using Sponsorship.Infrastructure.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sponsorship.Application.Services
{
    public class AdminService : IAdminService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IRequestRepository _requestRepo;
        private readonly IRepository<WorkflowHistory> _historyRepo;

        public AdminService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _requestRepo = unitOfWork.RequestRepository;
            _historyRepo = unitOfWork.WorkflowHistories;
        }

        public async Task<List<SponsorshipRequestDto>> GetAllRequests()
        {
            var requests = await _requestRepo.GetQueryable().Include(i => i.SponsorshipType).Include(ii => ii.Requestor).Select(s => new SponsorshipRequestDto
            {
                Id = s.Id,
                Title = s.Title,
                RequestorId = s.RequestorId,
                RequestorName = s.Requestor != null ? s.Requestor.FullName : "",
                Department = s.Department,
                SponsorshipTypeId = s.SponsorshipTypeId,
                SponsorshipTypeName = s.SponsorshipType != null ? s.SponsorshipType.TypeName : "",
                EventName = s.EventName,
                EventDate = s.EventDate,
                RequestedAmount = s.RequestedAmount,
                Justification = s.Justification,
                ExpectedBenefit = s.ExpectedBenefit,
                Remarks = s.Remarks,
                Status = s.Status,
                SubmittedAt = s.SubmittedAt,
                ManagerApprovedAt = s.ManagerApprovedAt,
                FinanceApprovedAt = s.FinanceApprovedAt,
                ManagerRemarks = s.ManagerRemarks,
                FinanceRemarks = s.FinanceRemarks,
                CreatedAt = s.CreatedAt,
                UpdatedAt = s.UpdatedAt
            }).ToListAsync();
            return requests;
        }

        public async Task<List<WorkflowHistoryDto>> GetRequestHistory(int requestId)
        {
            return await _historyRepo
                .GetQueryable()
                .Include(h => h.Actor)
                .Where(h => h.RequestId == requestId)
                .OrderByDescending(h => h.CreatedAt)
                .Select(h => new WorkflowHistoryDto
                {
                    Id = h.Id,
                    RequestId = h.RequestId,
                    Action = h.Action,
                    ActorUserId = h.ActorUserId,
                    Actor = h.Actor != null ? h.Actor.FullName : "",
                    Remarks = h.Remarks,
                    OldStatus = h.OldStatus,
                    NewStatus = h.NewStatus,
                    CreatedAt = h.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<SponsorshipRequestDto> GetRequestById(int id)
        {
            var requests = await _requestRepo.GetQueryable().Include(i => i.SponsorshipType).Include(ii => ii.Requestor).Where(w => w.Id == id).Select(s => new SponsorshipRequestDto
            {
                Id = s.Id,
                Title = s.Title,
                RequestorId = s.RequestorId,
                RequestorName = s.Requestor != null ? s.Requestor.FullName : "",
                Department = s.Department,
                SponsorshipTypeId = s.SponsorshipTypeId,
                SponsorshipTypeName = s.SponsorshipType != null ? s.SponsorshipType.TypeName : "",
                EventName = s.EventName,
                EventDate = s.EventDate,
                RequestedAmount = s.RequestedAmount,
                Justification = s.Justification,
                ExpectedBenefit = s.ExpectedBenefit,
                Remarks = s.Remarks,
                Status = s.Status,
                SubmittedAt = s.SubmittedAt,
                ManagerApprovedAt = s.ManagerApprovedAt,
                FinanceApprovedAt = s.FinanceApprovedAt,
                ManagerRemarks = s.ManagerRemarks,
                FinanceRemarks = s.FinanceRemarks,
                CreatedAt = s.CreatedAt,
                UpdatedAt = s.UpdatedAt
            }).FirstOrDefaultAsync();

            return requests;
        }
    }
}
