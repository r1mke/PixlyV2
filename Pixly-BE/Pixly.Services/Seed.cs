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
                    UserId = 1,
                    Username = "r1mke",
                    Email = "r1mke@example.com",
                    FirstName = "Kerim",
                    LastName = "Begic",
                    ProfilePictureUrl = "https://example.com/images/user1.jpg",
                    DateOfBirth = new DateTime(2000, 1, 1),
                    State = "Bosnia and Herzegovina",
                    PasswordHash = "testhash1",
                    PasswordSalt = "testsalt1"
                },
                new User
                {
                    UserId = 2,
                    Username = "sedin123",
                    Email = "sedin@example.com",
                    FirstName = "Sedin",
                    LastName = "Smajic",
                    ProfilePictureUrl = "https://example.com/images/user2.jpg",
                    DateOfBirth = new DateTime(1999, 5, 12),
                    State = "Bosnia and Herzegovina",
                    PasswordHash = "testhash2",
                    PasswordSalt = "testsalt2"
                }
            );
        }
    }
}
