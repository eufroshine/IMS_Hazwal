using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using System;
using System.Threading.Tasks;
using HazwalInventoryAPI.Models;
using HazwalInventoryAPI.DTOs;
using HazwalInventoryAPI.Helpers;

namespace HazwalInventoryAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminAuthController : ControllerBase
    {
        private readonly IMongoCollection<Admin> _admins;
        private readonly string _jwtSecret;

        // ✅ MongoDB diambil dari DI, BUKAN bikin client sendiri
        public AdminAuthController(IMongoDatabase database, IConfiguration config)
        {
            _admins = database.GetCollection<Admin>("admins");
            _jwtSecret = config["Jwt:Secret"] ?? "your_jwt_secret";
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest req)
        {
            var devSecret = Environment.GetEnvironmentVariable("DEVELOPER_SECRET") ?? "your_dev_secret";
            if (req.DevSecret != devSecret)
                return Unauthorized(new { success = false, message = "Unauthorized: devSecret salah" });

            if (string.IsNullOrWhiteSpace(req.Name) ||
                string.IsNullOrWhiteSpace(req.Email) ||
                string.IsNullOrWhiteSpace(req.Password))
                return BadRequest(new { success = false, message = "Semua field harus diisi" });

            var exists = await _admins.Find(a => a.Email == req.Email).FirstOrDefaultAsync();
            if (exists != null)
                return Conflict(new { success = false, message = "Email sudah terdaftar" });

            var admin = new Admin
            {
                Name = req.Name,
                Email = req.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(req.Password),
                IsAdmin = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _admins.InsertOneAsync(admin);

            return Ok(new
            {
                success = true,
                message = "Admin berhasil dibuat",
                admin = new AdminDto
                {
                    Id = admin.Id,
                    Name = admin.Name,
                    Email = admin.Email
                }
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
                return BadRequest(new { success = false, message = "Email dan password harus diisi" });

            var admin = await _admins.Find(a => a.Email == req.Email).FirstOrDefaultAsync();
            if (admin == null)
                return Unauthorized(new { success = false, message = "Admin tidak ditemukan" });

            if (!BCrypt.Net.BCrypt.Verify(req.Password, admin.Password))
                return Unauthorized(new { success = false, message = "Password salah" });

            var token = JwtHelper.GenerateToken(admin.Id, _jwtSecret);

            return Ok(new
            {
                success = true,
                message = "Login berhasil",
                token,
                user = new AdminDto
                {
                    Id = admin.Id,
                    Name = admin.Name,
                    Email = admin.Email
                }
            });
        }
    }

    // ===== REQUEST DTO =====
    public class RegisterRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string DevSecret { get; set; } = string.Empty;
    }
}
