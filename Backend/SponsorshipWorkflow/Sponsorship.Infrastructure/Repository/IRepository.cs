using System.Linq.Expressions;

namespace Sponsorship.Infrastructure.Repositories
{
    public interface IRepository<T> where T : class
    {
        IQueryable<T> GetQueryable();
        Task<T?> GetByIdAsync(int id);
        Task<IEnumerable<T>> GetAllAsync();
        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate, Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null);
        Task<T> AddAsync(T entity);
        void Update(T entity);
        void Delete(T entity);
        Task<int> CountAsync(Expression<Func<T, bool>>? predicate = null);
        Task<bool> AnyAsync(Expression<Func<T, bool>> predicate);
    }
}