using Sponsorship.Domain.Entities;

namespace Sponsorship.Infrastructure.Repositories
{
    public interface IUnitOfWork : IDisposable
    {
        // Generic Repositories
        IRepository<User> Users { get; }
        IRepository<SponsorshipRequest> SponsorshipRequests { get; }
        IRepository<WorkflowHistory> WorkflowHistories { get; }
        IRepository<SponsorshipType> SponsorshipTypes { get; }
        IRequestRepository RequestRepository { get; }

        // Save changes
        Task<int> SaveChangesAsync();
        Task BeginTransactionAsync();
        Task CommitTransactionAsync();
        Task RollbackTransactionAsync();
    }
}