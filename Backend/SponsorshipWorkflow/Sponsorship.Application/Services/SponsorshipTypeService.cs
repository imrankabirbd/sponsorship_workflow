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
    public class SponsorshipTypeService : ISponsorshipTypeService
    {
        private readonly IUnitOfWork _unitOfWork;

        public SponsorshipTypeService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<SponsorshipType> AddAsync(SponsorshipType model)
        {
            model.CreatedAt = DateTime.UtcNow;

            await _unitOfWork.SponsorshipTypes.AddAsync(model);

            await _unitOfWork.SaveChangesAsync();

            return model;
        }

        public async Task<SponsorshipType?> UpdateAsync(int id, SponsorshipType model)
        {
            var existing = await _unitOfWork.SponsorshipTypes.GetByIdAsync(id);

            if (existing == null || !existing.IsActive)
                return null;

            existing.TypeName = model.TypeName;
            existing.Description = model.Description;
            existing.MaxAmount = model.MaxAmount;
            existing.DisplayOrder = model.DisplayOrder;
            existing.UpdatedAt = DateTime.UtcNow;

            _unitOfWork.SponsorshipTypes.Update(existing);

            await _unitOfWork.SaveChangesAsync();

            return existing;
        }

        public async Task<IEnumerable<SponsorshipType>> GetAllAsync()
        {
            return await _unitOfWork.SponsorshipTypes.FindAsync(x => x.IsActive, o => o.OrderBy(x => x.Id));
        }

        public async Task<SponsorshipType?> GetByIdAsync(int id)
        {
            var item = await _unitOfWork.SponsorshipTypes.GetByIdAsync(id);

            return item?.IsActive == true ? item : null;
        }
    }
}
