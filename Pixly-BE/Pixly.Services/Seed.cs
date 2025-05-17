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

        public static void SeedTags(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Tag>().HasData(
                new Tag { Name = "AI" },
                new Tag { Name = "Machine Learning" },
                new Tag { Name = "Deep Learning" },
                new Tag { Name = "Image Generation" },
                new Tag { Name = "Neural Networks" },
                new Tag { Name = "Computer Vision" },
                new Tag { Name = "Photo Enhancement" },
                new Tag { Name = "Art" },
                new Tag { Name = "Digital Art" },
                new Tag { Name = "Creative AI" },
                new Tag { Name = "Automation" },
                new Tag { Name = "Innovation" },
                new Tag { Name = "Futuristic" },
                new Tag { Name = "Generative Art" },
                new Tag { Name = "Augmented Reality" }
            );
        }
    }
}
