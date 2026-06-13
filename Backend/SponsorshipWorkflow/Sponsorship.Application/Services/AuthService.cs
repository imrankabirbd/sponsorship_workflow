using Microsoft.EntityFrameworkCore;
using Sponsorship.Application.Interfaces;
using Sponsorship.Infrastructure.Data;
using Sponsorship.Application.DTOs;

namespace Sponsorship.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;

        public AuthService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<LoginDto?> AuthenticateAsync(LoginDto loginDto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == loginDto.Username);

            if (user == null)
                return null;

            // Verify password
            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
                return null;

            // Update last login
            user.LastLoginAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();


            return new LoginDto
            {
                Id = user.Id,
                Username = user.Username,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role.ToString(),
            };
        }
    }
}