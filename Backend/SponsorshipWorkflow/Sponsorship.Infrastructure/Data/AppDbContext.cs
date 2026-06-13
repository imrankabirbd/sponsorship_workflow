using Microsoft.EntityFrameworkCore;
using Sponsorship.Domain;
using Sponsorship.Domain.Entities;

namespace Sponsorship.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<SponsorshipRequest> SponsorshipRequests { get; set; }
        public DbSet<WorkflowHistory> WorkflowHistories { get; set; }
        public DbSet<SponsorshipType> SponsorshipTypes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationships
            modelBuilder.Entity<SponsorshipRequest>()
                .HasOne(r => r.Requestor)
                .WithMany(u => u.Requests)
                .HasForeignKey(r => r.RequestorId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<SponsorshipRequest>()
                .HasOne(r => r.SponsorshipType)
                .WithMany(t => t.Requests)
                .HasForeignKey(r => r.SponsorshipTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<WorkflowHistory>()
                .HasOne(h => h.Request)
                .WithMany(r => r.Histories)
                .HasForeignKey(h => h.RequestId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<WorkflowHistory>()
                .HasOne(h => h.Actor)
                .WithMany(u => u.WorkflowActions)
                .HasForeignKey(h => h.ActorUserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}