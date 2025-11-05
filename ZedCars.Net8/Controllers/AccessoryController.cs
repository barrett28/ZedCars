using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using ZedCars.Net8.Data;
using ZedCars.Net8.Models;
using ZedCars.Net8.ViewModels.HomeCont;

namespace ZedCars.Net8.Controllers
{
    public class AccessoryController : Controller
    {
        private readonly ZedCarsContext _context;
        public AccessoryController(ZedCarsContext context)
        {
            _context = context;
        }

        // GET all accessory
        // Accessory
        public async Task<IActionResult> Index(string? category,int page=1)
        {
            var accessories = await _context.Accessories
                .AsNoTracking()
                .Where(a => string.IsNullOrEmpty(category) || a.Category == category)
                .OrderBy(a => a.AccessoryId)
                .ToListAsync();

            const int pageSize = 6;
            var Accessories = accessories.Count;
            var totalPages = (int)Math.Ceiling((double)  Accessories/ pageSize);
            var pagedAccessories = accessories.Skip((page - 1) * pageSize).Take(pageSize).ToList();

            var viewModel = new AccessoryIndexViewModel
            {
                Accessories = pagedAccessories,
                Categories = new SelectList(
                    await _context.Accessories
                        .Select(a => a.Category)
                        .Distinct()
                        .ToListAsync(),
                    category
                ),
                CurrentPage = page,
                PageSize = pageSize,
                TotalPages = totalPages,
                TotalAccessories = Accessories,
                SelectedCategory = category
            };

            return View(viewModel);
        }


        // GET accessories by id    
        // Accessory/Details/5
        public async Task<IActionResult> Details(int? id)
        {
                if (id == null) return NotFound();
                var accessory = await _context.Accessories.AsNoTracking().FirstOrDefaultAsync(a => a.AccessoryId == id);
                return View(accessory);
        }

        // GET: Accessory/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST 
        // Accessory/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Accessory accessory)
        {
            if (ModelState.IsValid)
            {
                accessory.CreatedDate = DateTime.Now;
                accessory.CreatedBy = User.Identity?.Name ?? "SuperAdmin";
                accessory.ModifiedDate = DateTime.Now;
                accessory.ModifiedBy = User.Identity?.Name ?? "SuperAdmin";

                _context.Add(accessory);
                await _context.SaveChangesAsync();
            }
            return View(accessory);
        }


        // GET: Accessory/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();

            var accessory = await _context.Accessories.FindAsync(id);
            if (accessory == null) return NotFound();

            return View(accessory);
        }


        // POST 
        // Accessory/Edit
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Accessory accessory)
        {
            if (id != accessory.AccessoryId) return NotFound();

            if (ModelState.IsValid)
            {
                var existingAccessory = await _context.Accessories.FindAsync(id);
                if (existingAccessory == null)
                {
                    return NotFound();
                }

                // Update fields
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

                TempData["SuccessMessage"] = $"Accessory {accessory.Name} updated successfully!";
                return RedirectToAction("Index");
            }

            return View(accessory);
        }


        // GET Accessory/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null) return NotFound();

            var accessory = await _context.Accessories
                .AsNoTracking().FirstOrDefaultAsync(m => m.AccessoryId == id);
            if (accessory == null) return NotFound();

            return View(accessory);
        }

        // POST Accessory/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var accessory = await _context.Accessories.FindAsync(id);
            if (accessory != null)
            {
                accessory.IsActive = false;
                accessory.ModifiedDate = DateTime.Now;
                accessory.ModifiedBy = User.Identity?.Name;
                await _context.SaveChangesAsync();
            }
            return RedirectToAction("Index");
        }
    }
}
