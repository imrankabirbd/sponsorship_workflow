using Sponsorship.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sponsorship.Application.Interfaces
{
    public interface ISponsorshipTypeService
    {
        Task<SponsorshipType> AddAsync(SponsorshipType model);

        Task<SponsorshipType?> UpdateAsync(int id, SponsorshipType model);

        Task<IEnumerable<SponsorshipType>> GetAllAsync();

        Task<SponsorshipType?> GetByIdAsync(int id);
    }
}
