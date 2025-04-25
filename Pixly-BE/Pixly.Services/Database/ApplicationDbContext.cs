using Microsoft.EntityFrameworkCore;

namespace Pixly.Services.Database
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<PhotoTag> PhotoTags { get; set; }
        public DbSet<Like> Likes { get; set; }
        public DbSet<Favorite> Favorites { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            DataSeed.Seed(modelBuilder);
        }
    }
}
