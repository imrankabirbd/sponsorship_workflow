using Microsoft.EntityFrameworkCore;
using Sponsorship.Domain;
using Sponsorship.Domain.Entities;
using Sponsorship.Infrastructure.Data;

namespace Sponsorship.Infrastructure.Repositories
{
    public class RequestRepository : GenericRepository<SponsorshipRequest>, IRequestRepository
    {
        public RequestRepository(AppDbContext context) : base(context)
        {
        }        
    }
}