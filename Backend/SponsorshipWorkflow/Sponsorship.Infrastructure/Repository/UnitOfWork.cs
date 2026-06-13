using Sponsorship.Domain.Entities;
using Sponsorship.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore;
using Sponsorship.Domain;

namespace Sponsorship.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;
        private IDbContextTransaction? _transaction;

        public UnitOfWork(AppDbContext context)
        {
            _context = context;
        }

        private IRepository<User>? _users;
        private IRepository<SponsorshipRequest>? _sponsorshipRequests;
        private IRepository<WorkflowHistory>? _workflowHistories;
        private IRepository<SponsorshipType>? _sponsorshipTypes;
        private IRequestRepository? _requestRepository;

        public IRepository<User> Users => _users ??= new GenericRepository<User>(_context);

        public IRepository<SponsorshipRequest> SponsorshipRequests =>
            _sponsorshipRequests ??= new GenericRepository<SponsorshipRequest>(_context);

        public IRepository<WorkflowHistory> WorkflowHistories =>
            _workflowHistories ??= new GenericRepository<WorkflowHistory>(_context);

        public IRepository<SponsorshipType> SponsorshipTypes =>
            _sponsorshipTypes ??= new GenericRepository<SponsorshipType>(_context);

        public IRequestRepository RequestRepository =>
            _requestRepository ??= new RequestRepository(_context);

        public async Task<int> SaveChangesAsync()
        {
            // Auto-update audit fields
            var entries = _context.ChangeTracker.Entries<BaseEntity>();
            foreach (var entry in entries)
            {
                if (entry.State == EntityState.Modified)
                {
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                }
            }

            return await _context.SaveChangesAsync();
        }

        public async Task BeginTransactionAsync()
        {
            _transaction = await _context.Database.BeginTransactionAsync();
        }

        public async Task CommitTransactionAsync()
        {
            if (_transaction != null)
            {
                await _transaction.CommitAsync();
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public async Task RollbackTransactionAsync()
        {
            if (_transaction != null)
            {
                await _transaction.RollbackAsync();
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public void Dispose()
        {
            _transaction?.Dispose();
            _context.Dispose();
        }
    }
}