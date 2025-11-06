using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZedCars.Net8.Data;
using ZedCars.Net8.Models;

namespace ZedCars.Net8.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccessoryController : ControllerBase
    {
        private readonly ZedCarsContext _context;
        public AccessoryController(ZedCarsContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAccessories([FromQuery] string? category, [FromQuery] int page = 1)
        {
            var accessories = await _context.Accessories
                .AsNoTracking()
                .Where(a => string.IsNullOrEmpty(category) || a.Category == category)
                .OrderBy(a => a.AccessoryId)
                .ToListAsync();

            const int pageSize = 6;
            var totalAccessories = accessories.Count;
            var totalPages = (int)Math.Ceiling((double)totalAccessories / pageSize);
            var pagedAccessories = accessories.Skip((page - 1) * pageSize).Take(pageSize).ToList();

            var categories = await _context.Accessories
                .Select(a => a.Category)
                .Distinct()
                .ToListAsync();

            var result = new
            {
                Accessories = pagedAccessories,
                Categories = categories,
                CurrentPage = page,
                PageSize = pageSize,
                TotalPages = totalPages,
                TotalAccessories = totalAccessories,
                SelectedCategory = category
            };

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAccessory(int id)
        {
            var accessory = await _context.Accessories.AsNoTracking().FirstOrDefaultAsync(a => a.AccessoryId == id);
            if (accessory == null) return NotFound();
            
            return Ok(accessory);
        }

        [HttpPost]
        [Authorize(Roles = "SuperAdmin,Manager")]
        public async Task<IActionResult> CreateAccessory([FromBody] Accessory accessory)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            accessory.CreatedDate = DateTime.Now;
            accessory.CreatedBy = User.Identity?.Name ?? "SuperAdmin";
            accessory.ModifiedDate = DateTime.Now;
            accessory.ModifiedBy = User.Identity?.Name ?? "SuperAdmin";

            _context.Add(accessory);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAccessory), new { id = accessory.AccessoryId }, accessory);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "SuperAdmin,Manager")]
        public async Task<IActionResult> UpdateAccessory(int id, [FromBody] Accessory accessory)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingAccessory = await _context.Accessories.FindAsync(id);
            if (existingAccessory == null)
                return NotFound();

            existingAccessory.Name = accessory.Name;
            existingAccessory.Category = accessory.Category;
            existingAccessory.Price = accessory.Price;
            existingAccessory.StockQuantity = accessory.StockQuantity;
            existingAccessory.Description = accessory.Description;
            existingAccessory.PartNumber = accessory.PartNumber;
            existingAccessory.Manufacturer = accessory.Manufacturer;
            existingAccessory.IsActive = accessory.IsActive;
            existingAccessory.ModifiedDate = DateTime.Now;
            existingAccessory.ModifiedBy = User.Identity?.Name ?? "SuperAdmin";

            await _context.SaveChangesAsync();

            return Ok(existingAccessory);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "SuperAdmin,Manager")]
        public async Task<IActionResult> DeleteAccessory(int id)
        {
            var accessory = await _context.Accessories.FindAsync(id);
            if (accessory == null)
                return NotFound();

            accessory.IsActive = false;
            accessory.ModifiedDate = DateTime.Now;
            accessory.ModifiedBy = User.Identity?.Name ?? "SuperAdmin";
            
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
