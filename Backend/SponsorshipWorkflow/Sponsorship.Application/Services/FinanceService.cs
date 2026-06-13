using Microsoft.EntityFrameworkCore;
using Sponsorship.Application.DTOs;
using Sponsorship.Application.Interfaces;
using Sponsorship.Domain;
using Sponsorship.Domain.Entities;
using Sponsorship.Infrastructure.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sponsorship.Application.Services
{
    public class FinanceService : IFinanceService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IRequestRepository _requestRepo;
        private readonly IRepository<WorkflowHistory> _historyRepo;

        public FinanceService(IUnitOfWork unitOfWork) 
        {
            _unitOfWork = unitOfWork;
            _requestRepo = unitOfWork.RequestRepository;
            _historyRepo = unitOfWork.WorkflowHistories;
        }

        public async Task<List<SponsorshipRequest>> GetPendingRequests()
        {
            var requests = await _requestRepo.FindAsync(r => r.Status == RequestStatus.PendingFinance);
            return requests.ToList();
        }

        public async Task<SponsorshipRequest> Approve(int requestId, int financeId, string remarks)
        {
            var request = await _requestRepo.GetByIdAsync(requestId);

            if (request == null)
                throw new Exception("Request not found");

            if (request.Status != RequestStatus.PendingFinance)
                throw new Exception($"Cannot approve request in {request.Status} status");

            await _unitOfWork.BeginTransactionAsync();

            try
            {
                var oldStatus = request.Status;
                request.Status = RequestStatus.Approved;
                request.FinanceApprovedAt = DateTime.UtcNow;
                request.FinanceRemarks = remarks;

                _requestRepo.Update(request);

                var history = new WorkflowHistory
                {
                    RequestId = requestId,
                    Action = "FINANCE_APPROVE",
                    ActorUserId = financeId,
                    OldStatus = oldStatus,
                    NewStatus = RequestStatus.Approved,
                    Remarks = remarks,
                    CreatedAt = DateTime.UtcNow
                };

                await _historyRepo.AddAsync(history);
                await _unitOfWork.SaveChangesAsync();
                await _unitOfWork.CommitTransactionAsync();

                return request;
            }
            catch
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }

        public async Task<SponsorshipRequest> Reject(int requestId, int financeId, string remarks)
        {
            var request = await _requestRepo.GetByIdAsync(requestId);

            if (request == null)
                throw new Exception("Request not found");

            if (request.Status != RequestStatus.PendingFinance)
                throw new Exception($"Cannot reject request in {request.Status} status");

            var oldStatus = request.Status;
            request.Status = RequestStatus.Rejected;
            request.FinanceRemarks = remarks;

            _requestRepo.Update(request);

            var history = new WorkflowHistory
            {
                RequestId = requestId,
                Action = "FINANCE_REJECT",
                ActorUserId = financeId,
                OldStatus = oldStatus,
                NewStatus = RequestStatus.Rejected,
                Remarks = remarks,
                CreatedAt = DateTime.UtcNow
            };

            await _historyRepo.AddAsync(history);
            await _unitOfWork.SaveChangesAsync();

            return request;
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
