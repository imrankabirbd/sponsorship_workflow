using Sponsorship.Application.DTOs;

namespace Sponsorship.Application.Interfaces
{
    public interface IAuthService
    {
        Task<LoginDto?> AuthenticateAsync(LoginDto loginDto);
    }
}