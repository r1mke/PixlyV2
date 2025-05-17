using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Pixly.Services.Database;

namespace Pixly.Services
{
    public static class DataSeed
    {
        public static void Seed(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    UserName = "r1mke",
                    Email = "r1mke@example.com",
                    FirstName = "Kerim",
                    LastName = "Begic",
                    ProfilePictureUrl = "https://example.com/images/user1.jpg",
                    DateOfBirth = new DateTime(2000, 1, 1),
                    State = "Bosnia and Herzegovina",
                },
                new User
                {
                    Email = "sedin@example.com",
                    FirstName = "Sedin",
                    LastName = "Smajic",
                    ProfilePictureUrl = "https://example.com/images/user2.jpg",
                    DateOfBirth = new DateTime(1999, 5, 12),
                    State = "Bosnia and Herzegovina",
                    PasswordHash = "testhash2",
                }
            );
        }

        public static void SeedRoles(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<IdentityRole>().HasData(
                new IdentityRole
                {
                    Id = "1",
                    Name = "Admin",
                    NormalizedName = "ADMIN"
                },
                new IdentityRole
                {
                    Id = "2",
                    Name = "User",
                    NormalizedName = "USER"
                }
            );
        }

    }
}
