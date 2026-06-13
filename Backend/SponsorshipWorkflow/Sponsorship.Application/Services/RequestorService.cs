using Sponsorship.Application.DTOs;
using Sponsorship.Application.Interfaces;
using Sponsorship.Domain.Entities;
using Sponsorship.Domain;
using Sponsorship.Infrastructure.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Sponsorship.Application.Services
{
    public class RequestorService : IRequestorService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IRequestRepository _requestRepo;
        private readonly IRepository<WorkflowHistory> _historyRepo;

        public RequestorService(IUnitOfWork unitOfWork) 
        {
            _unitOfWork = unitOfWork;
            _requestRepo = unitOfWork.RequestRepository;
            _historyRepo = unitOfWork.WorkflowHistories;
        }

        public async Task<SponsorshipRequest> CreateRequestAsync(SponsorshipRequestDto dto)
        {
            try
            {
                var request = new SponsorshipRequest
                {
                    Title = dto.Title,
                    RequestorId = dto.RequestorId,
                    Department = dto.Department,
                    SponsorshipTypeId = dto.SponsorshipTypeId,
                    EventName = dto.EventName,
                    EventDate = dto.EventDate.ToUniversalTime(),
                    RequestedAmount = dto.RequestedAmount,
                    Justification = dto.Justification,
                    ExpectedBenefit = dto.ExpectedBenefit,
                    Remarks = dto.Remarks,
                    Status = RequestStatus.Draft,
                    CreatedAt = DateTime.UtcNow
                };

                await _requestRepo.AddAsync(request);
                await _unitOfWork.SaveChangesAsync();

                return request;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<SponsorshipRequest> SubmitRequestAsync(int requestId, int userId)
        {
            var request = await _requestRepo.GetByIdAsync(requestId);

            if (request == null)
                throw new Exception("Request not found");

            if (request.RequestorId != userId)
                throw new Exception("You can only submit your own requests");

            if (request.Status != RequestStatus.Draft)
                throw new Exception($"Cannot submit request in {request.Status} status");

            // Start transaction
            await _unitOfWork.BeginTransactionAsync();

            try
            {
                var oldStatus = request.Status;
                request.Status = RequestStatus.PendingManager;
                request.SubmittedAt = DateTime.UtcNow;

                _requestRepo.Update(request);

                var history = new WorkflowHistory
                {
                    RequestId = requestId,
                    Action = "SUBMIT",
                    ActorUserId = userId,
                    OldStatus = oldStatus,
                    NewStatus = RequestStatus.PendingManager,
                    Remarks = "Request submitted for manager approval",
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
        
        public async Task<SponsorshipRequest> UpdateRequestAsync(int requestId, SponsorshipRequestDto dto)
        {
            try
            {
                var request = await _requestRepo.GetByIdAsync(requestId);
                request.Title = dto.Title;
                request.Department = dto.Department;
                request.SponsorshipTypeId = dto.SponsorshipTypeId;
                request.EventName = dto.EventName;
                request.EventDate = dto.EventDate.ToUniversalTime();
                request.RequestedAmount = dto.RequestedAmount;
                request.Justification = dto.Justification;
                request.ExpectedBenefit = dto.ExpectedBenefit;
                request.Remarks = dto.Remarks;
                _requestRepo.Update(request);
                await _unitOfWork.SaveChangesAsync();

                return request;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<SponsorshipRequest> CancelRequestAsync(int requestId, int userId)
        {
            var request = await _requestRepo.GetByIdAsync(requestId);

            if (request == null)
                throw new Exception("Request not found");

            if (request.Status != RequestStatus.PendingManager)
                throw new Exception($"Cannot cancle request in {request.Status} status");

            await _unitOfWork.BeginTransactionAsync();

            try
            {
                var oldStatus = request.Status;
                request.Status = RequestStatus.Cancelled;
                request.CreatedAt = DateTime.UtcNow;

                _requestRepo.Update(request);

                var history = new WorkflowHistory
                {
                    RequestId = requestId,
                    Action = "CANCLE_REQUEST",
                    ActorUserId = request.RequestorId,
                    OldStatus = oldStatus,
                    NewStatus = RequestStatus.Cancelled,
                    Remarks = "Request cancelled by requestor",
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

        public async Task<List<SponsorshipRequest>> GetUserRequestsAsync(int userId)
        {
            var requests = await _requestRepo.FindAsync(r => r.RequestorId == userId);
            return requests.OrderByDescending(r => r.CreatedAt).ToList();
        }

        public async Task<SponsorshipRequestDto> GetRequestByIdAsync(int id)
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
