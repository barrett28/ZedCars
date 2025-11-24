using Microsoft.EntityFrameworkCore;
using ZedCars.Net8.Models;

namespace ZedCars.Net8.Data
{
    public class ZedCarsContext : DbContext
    {
        public ZedCarsContext(DbContextOptions<ZedCarsContext> options) : base(options)
        {
        }

        public DbSet<Car> Cars { get; set; }
        public DbSet<Admin> Admins { get; set; }

        public DbSet<Accessory> Accessories { get; set; }

        public DbSet<Purchase> Purchases { get; set; }
        public DbSet<PurchaseAccessoryWithCar> PurchaseAccessoryWithCar { get; set; }
        public DbSet<AccessoryPurchaseOnly> AccessoryPurchaseOnly { get; set; }

        public DbSet<TestDrive> TestDrives { get; set; }

        public DbSet<UserActivity> UserActivities { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Car entity
            modelBuilder.Entity<Car>(entity =>
            {
                entity.HasKey(e => e.CarId);
                entity.Property(e => e.Price).HasPrecision(10, 2);
                entity.Ignore(e => e.Make); // Ignore computed property
                entity.HasIndex(e => e.Brand);
                entity.HasIndex(e => e.Model);
                entity.HasIndex(e => e.IsActive);
            });

            // Configure Admin entity
            modelBuilder.Entity<Admin>(entity =>
            {
                entity.HasKey(e => e.AdminId);
                entity.HasIndex(e => e.Username).IsUnique();
                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasIndex(e => e.IsActive);
            });

            // Configure Accessory entity
            modelBuilder.Entity<Accessory>(entity =>
            {
                entity.HasKey(e => e.AccessoryId);
                entity.Property(e => e.Price).HasPrecision(10, 2);
                entity.HasIndex(e => e.Name);
                entity.HasIndex(e => e.Category);
                entity.HasIndex(e => e.IsActive);
            });

            modelBuilder.Entity<Purchase>(entity =>
            {
                entity.HasKey(e => e.PurchaseId);
                entity.Property(e => e.PurchasePrice).HasPrecision(18, 2);
                entity.HasOne(e => e.Car)
                      .WithMany() // A car can appear in many purchases
                      .HasForeignKey(e => e.CarId)
                      .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete
            });

            modelBuilder.Entity<TestDrive>(entity =>
            {
                entity.HasKey(e => e.TestDriveId);
                entity.HasOne(e => e.Car).WithMany()
                .HasForeignKey(e => e.CarId)
                .OnDelete(DeleteBehavior.Restrict);
                entity.HasIndex(e => e.BookingDate);
                entity.HasIndex(e => e.Status);
            });
            
            // Configure renamed tables
            modelBuilder.Entity<PurchaseAccessoryWithCar>(entity =>
            {
                entity.ToTable("PurchaseAccessoryWithCar");

                entity.HasKey(e => e.PurchaseAccessoryId); 

                // Explicit FK mapping
                entity.HasOne(e => e.Purchase)          // navigation property
                      .WithMany()                        // purchases can have many accessory entries
                      .HasForeignKey(e => e.PurchaseId) // your FK property
                      .OnDelete(DeleteBehavior.Cascade);

                // optional: index
                entity.HasIndex(e => e.PurchaseId);
            });

            modelBuilder.Entity<AccessoryPurchaseOnly>(entity =>
            {
                entity.ToTable("AccessoryPurchaseOnly");
                entity.HasKey(e => e.AccessoryPurchaseId);
            });

            modelBuilder.Entity<UserActivity>(entity =>
            {
                entity.HasKey(e => e.ActivityId);
                entity.HasIndex(e => e.Username);
                entity.HasIndex(e => e.ActivityDate);
                entity.HasIndex(e => e.ActivityType);
            });

            // Configure RefreshToken entity
            modelBuilder.Entity<RefreshToken>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.Admin)
                      .WithMany(a => a.RefreshTokens)
                      .HasForeignKey(e => e.AdminId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.HasIndex(e => e.Token);
                entity.HasIndex(e => e.ExpiryDate);
                entity.HasIndex(e => e.AdminId).IsUnique(); // One token per user
            });
        }
    }
}
