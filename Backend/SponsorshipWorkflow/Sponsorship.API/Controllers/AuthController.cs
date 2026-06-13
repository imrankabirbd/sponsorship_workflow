using Microsoft.AspNetCore.Mvc;
using Sponsorship.Application.DTOs;
using Sponsorship.Application.Interfaces;
using Sponsorship.Domain.Entities;
using Sponsorship.Domain;
using Sponsorship.Infrastructure.Repositories;
using Microsoft.AspNetCore.Cors;

namespace Sponsorship.API.Controllers
{
    
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IRepository<User> _userRepository;
        private readonly IUnitOfWork _unitOfWork;

        public AuthController(IRepository<User> userRepository, IUnitOfWork unitOfWork)
        {
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid request", errors = ModelState });
            }

            var users = await _userRepository.FindAsync(u => u.Username == loginDto.Username);
            var user = users.FirstOrDefault();

            if (user == null)
            {
                return Unauthorized(new { message = "Invalid username or password" });
            }

            bool isPasswordValid = false;

            if (string.IsNullOrEmpty(user.PasswordHash))
            {
                isPasswordValid = loginDto.Password == "Pass@123" || loginDto.Password == user.Username;
            }
            else
            {
                try
                {
                    isPasswordValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash);
                }
                catch
                {
                    isPasswordValid = loginDto.Password == user.PasswordHash;
                }
            }

            if (!isPasswordValid)
            {
                return Unauthorized(new { message = "Invalid username or password" });
            }


            user.LastLoginAt = DateTime.UtcNow;
            _userRepository.Update(user);
            await _unitOfWork.SaveChangesAsync();

            return Ok(new LoginDto
            {
                Id = user.Id,
                Username = user.Username,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role.ToString(),
                Department = user.Department,
                Message = "Login successful",
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] LoginDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid request", errors = ModelState });
            }

            // Check if username already exists
            var existingUsers = await _userRepository.FindAsync(u => u.Username == dto.Username);
            if (existingUsers.Any())
            {
                return BadRequest(new { message = "Username already exists" });
            }

            // Create new user
            var user = new User
            {
                Username = dto.Username,
                FullName = dto.FullName,
                Email = dto.Email,
                Department = dto.Department,
                Role = Enum.Parse<UserRole>(dto.Role),
                PasswordHash = dto.Password,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            await _userRepository.AddAsync(user);
            await _unitOfWork.SaveChangesAsync();

            return Ok(new
            {
                message = "User registered successfully",
                user = new
                {
                    user.Id,
                    user.Username,
                    user.FullName,
                    user.Email,
                    user.Department,
                    Role = user.Role.ToString()
                }
            });
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userRepository.GetAllAsync();
            var result = users.Select(u => new
            {
                u.Id,
                u.Username,
                u.FullName,
                u.Email,
                u.Department,
                Role = u.Role.ToString(),
                u.IsActive,
                u.LastLoginAt,
                u.CreatedAt
            });

            return Ok(result);
        }

        [HttpGet("users/{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);

            if (user == null)
            {
                return NotFound(new { message = $"User with ID {id} not found" });
            }

            return Ok(new
            {
                user.Id,
                user.Username,
                user.FullName,
                user.Email,
                user.Department,
                Role = user.Role.ToString(),
                user.IsActive,
                user.LastLoginAt,
                user.CreatedAt
            });
        }

        [HttpGet("users/by-role/{role}")]
        public async Task<IActionResult> GetUsersByRole(string role)
        {
            var users = await _userRepository.FindAsync(u => u.Role.ToString() == role);

            return Ok(users.Select(u => new
            {
                u.Id,
                u.Username,
                u.FullName,
                u.Email,
                u.Department,
                Role = u.Role.ToString()
            }));
        }

        [HttpGet("check/{userId}")]
        public async Task<IActionResult> CheckUserExists(int userId)
        {
            var exists = await _userRepository.AnyAsync(u => u.Id == userId);

            if (!exists)
            {
                return NotFound(new
                {
                    exists = false,
                    message = $"User with ID {userId} does not exist"
                });
            }

            var user = await _userRepository.GetByIdAsync(userId);

            return Ok(new
            {
                exists = true,
                user = new
                {
                    user.Id,
                    user.Username,
                    user.FullName,
                    Role = user.Role.ToString()
                }
            });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            return Ok(new { message = "Logout successful. Please clear your local session data." });
        }
    }
}