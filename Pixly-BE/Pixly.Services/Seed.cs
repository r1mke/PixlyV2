using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Pixly.Services.Database;

namespace Pixly.Services
{
    public static class DataSeed
    {
        public static void Seed(ModelBuilder modelBuilder)
        {
            // Seed Users first
            SeedUsers(modelBuilder);

            // Seed Tags
            SeedTags(modelBuilder);

            // Seed Report Types
            SeedReportTypes(modelBuilder);

            // Seed Report Statuses
            SeedReportStatuses(modelBuilder);

            // Seed Photos (depends on Users and Tags)
            SeedPhotos(modelBuilder);

            // Seed Reports (depends on Users, Photos, ReportTypes and ReportStatuses)
            SeedReports(modelBuilder);
        }

        private static void SeedUsers(ModelBuilder modelBuilder)
        {
            var passwordHasher = new PasswordHasher<User>();

            var user1 = new User
            {
                Id = "user-1-guid-12345",
                UserName = "r1mke@example.com",
                NormalizedUserName = "R1MKE@EXAMPLE.COM",
                Email = "r1mke@example.com",
                NormalizedEmail = "R1MKE@EXAMPLE.COM",
                EmailConfirmed = true,
                FirstName = "Kerim",
                LastName = "Begic",
                ProfilePictureUrl = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
                DateOfBirth = new DateTime(2000, 1, 1),
                State = "Bosnia and Herzegovina",
                CreatedAt = DateTime.UtcNow.AddDays(-30),
                IsActive = true,
                SecurityStamp = Guid.NewGuid().ToString(),
                ConcurrencyStamp = Guid.NewGuid().ToString()
            };
            user1.PasswordHash = passwordHasher.HashPassword(user1, "Password123!");

            var user2 = new User
            {
                Id = "user-2-guid-67890",
                UserName = "sedin@example.com",
                NormalizedUserName = "SEDIN@EXAMPLE.COM",
                Email = "sedin@example.com",
                NormalizedEmail = "SEDIN@EXAMPLE.COM",
                EmailConfirmed = true,
                FirstName = "Sedin",
                LastName = "Smajic",
                ProfilePictureUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
                DateOfBirth = new DateTime(1999, 5, 12),
                State = "Bosnia and Herzegovina",
                CreatedAt = DateTime.UtcNow.AddDays(-25),
                IsActive = true,
                SecurityStamp = Guid.NewGuid().ToString(),
                ConcurrencyStamp = Guid.NewGuid().ToString()
            };
            user2.PasswordHash = passwordHasher.HashPassword(user2, "Password123!");

            var user3 = new User
            {
                Id = "user-3-guid-11111",
                UserName = "ana@example.com",
                NormalizedUserName = "ANA@EXAMPLE.COM",
                Email = "ana@example.com",
                NormalizedEmail = "ANA@EXAMPLE.COM",
                EmailConfirmed = true,
                FirstName = "Ana",
                LastName = "Petrovic",
                ProfilePictureUrl = "https://images.unsplash.com/photo-1494790108755-2616c31e4fb6?w=400",
                DateOfBirth = new DateTime(1998, 8, 20),
                State = "Serbia",
                CreatedAt = DateTime.UtcNow.AddDays(-20),
                IsActive = true,
                SecurityStamp = Guid.NewGuid().ToString(),
                ConcurrencyStamp = Guid.NewGuid().ToString()
            };
            user3.PasswordHash = passwordHasher.HashPassword(user3, "Password123!");

            modelBuilder.Entity<User>().HasData(user1, user2, user3);
        }

        private static void SeedTags(ModelBuilder modelBuilder)
        {
            var tags = new[]
            {
                new Tag { TagId = 1, Name = "Nature" },
                new Tag { TagId = 2, Name = "Architecture" },
                new Tag { TagId = 3, Name = "Portrait" },
                new Tag { TagId = 4, Name = "Street" },
                new Tag { TagId = 5, Name = "Landscape" },
                new Tag { TagId = 6, Name = "Urban" },
                new Tag { TagId = 7, Name = "Travel" },
                new Tag { TagId = 8, Name = "Art" },
                new Tag { TagId = 9, Name = "Black and White" },
                new Tag { TagId = 10, Name = "Sunset" },
                new Tag { TagId = 11, Name = "Ocean" },
                new Tag { TagId = 12, Name = "Mountains" },
                new Tag { TagId = 13, Name = "City" },
                new Tag { TagId = 14, Name = "Abstract" },
                new Tag { TagId = 15, Name = "Minimalist" },
                new Tag { TagId = 16, Name = "Vintage" },
                new Tag { TagId = 17, Name = "Modern" },
                new Tag { TagId = 18, Name = "Colorful" },
                new Tag { TagId = 19, Name = "Wildlife" },
                new Tag { TagId = 20, Name = "Fashion" }
            };

            modelBuilder.Entity<Tag>().HasData(tags);
        }

        private static void SeedReportTypes(ModelBuilder modelBuilder)
        {
            var reportTypes = new[]
            {
                new ReportType { ReportTypeId = 1, ReportTypeName = "Inappropriate Content" },
                new ReportType { ReportTypeId = 2, ReportTypeName = "Copyright Violation" },
                new ReportType { ReportTypeId = 3, ReportTypeName = "Nudity or Sexual Content" },
                new ReportType { ReportTypeId = 4, ReportTypeName = "Violence or Graphic Content" },
                new ReportType { ReportTypeId = 5, ReportTypeName = "Hate Speech or Discrimination" },
                new ReportType { ReportTypeId = 6, ReportTypeName = "Spam or Misleading" },
                new ReportType { ReportTypeId = 7, ReportTypeName = "Privacy Violation" },
                new ReportType { ReportTypeId = 8, ReportTypeName = "Stolen or Unauthorized Use" },
                new ReportType { ReportTypeId = 9, ReportTypeName = "Low Quality or Irrelevant" },
                new ReportType { ReportTypeId = 10, ReportTypeName = "Other" }
            };

            modelBuilder.Entity<ReportType>().HasData(reportTypes);
        }

        private static void SeedReportStatuses(ModelBuilder modelBuilder)
        {
            var reportStatuses = new[]
            {
                new ReportStatus { ReportStatusId = 1, ReportStatusName = "Pending" },
                new ReportStatus { ReportStatusId = 2, ReportStatusName = "Under Review" },
                new ReportStatus { ReportStatusId = 3, ReportStatusName = "Resolved" },
                new ReportStatus { ReportStatusId = 4, ReportStatusName = "Dismissed" },
                new ReportStatus { ReportStatusId = 5, ReportStatusName = "In Progress" },
            };

            modelBuilder.Entity<ReportStatus>().HasData(reportStatuses);
        }

        private static void SeedPhotos(ModelBuilder modelBuilder)
        {
            var currentDate = DateTime.UtcNow;
            var random = new Random(42); // Fixed seed for consistent results

            var photos = new[]
            {
                new Photo
                {
                    PhotoId = 1,
                    Title = "Golden Hour Mountain View",
                    Description = "Breathtaking mountain landscape during golden hour",
                    Url = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
                    Slug = "golden-hour-mountain-view-123456",
                    Width = 1920,
                    Height = 1280,
                    Format = "jpg",
                    FileSize = 2500000,
                    UploadedAt = currentDate.AddDays(-15),
                    UserId = "user-1-guid-12345",
                    State = "Approved",
                    ViewCount = random.Next(100, 500),
                    LikeCount = random.Next(20, 100),
                    DownloadCount = random.Next(5, 50),
                    Orientation = "landscape",
                    IsDeleted = false
                },
                new Photo
                {
                    PhotoId = 2,
                    Title = "Urban Architecture",
                    Description = "Modern building with clean lines and geometric patterns",
                    Url = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
                    Slug = "urban-architecture-234567",
                    Width = 1080,
                    Height = 1620,
                    Format = "jpg",
                    FileSize = 1800000,
                    UploadedAt = currentDate.AddDays(-12),
                    UserId = "user-2-guid-67890",
                    State = "Approved",
                    ViewCount = random.Next(100, 500),
                    LikeCount = random.Next(20, 100),
                    DownloadCount = random.Next(5, 50),
                    Orientation = "portrait",
                    IsDeleted = false
                },
                new Photo
                {
                    PhotoId = 3,
                    Title = "Ocean Waves",
                    Description = "Powerful ocean waves crashing against the shore",
                    Url = "https://images.unsplash.com/photo-1505142468610-359e7d316be0",
                    Slug = "ocean-waves-345678",
                    Width = 1920,
                    Height = 1080,
                    Format = "jpg",
                    FileSize = 2200000,
                    UploadedAt = currentDate.AddDays(-10),
                    UserId = "user-3-guid-11111",
                    State = "Approved",
                    ViewCount = random.Next(100, 500),
                    LikeCount = random.Next(20, 100),
                    DownloadCount = random.Next(5, 50),
                    Orientation = "landscape",
                    IsDeleted = false
                },
                new Photo
                {
                    PhotoId = 4,
                    Title = "Street Art Portrait",
                    Description = "Vibrant street art mural in downtown area",
                    Url = "https://images.unsplash.com/photo-1541961017774-22349e4a1262",
                    Slug = "street-art-portrait-456789",
                    Width = 1080,
                    Height = 1080,
                    Format = "jpg",
                    FileSize = 1600000,
                    UploadedAt = currentDate.AddDays(-8),
                    UserId = "user-1-guid-12345",
                    State = "Approved",
                    ViewCount = random.Next(100, 500),
                    LikeCount = random.Next(20, 100),
                    DownloadCount = random.Next(5, 50),
                    Orientation = "square",
                    IsDeleted = false
                },
                new Photo
                {
                    PhotoId = 5,
                    Title = "Forest Path",
                    Description = "Mysterious forest path surrounded by tall trees",
                    Url = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
                    Slug = "forest-path-567890",
                    Width = 1600,
                    Height = 1200,
                    Format = "jpg",
                    FileSize = 2000000,
                    UploadedAt = currentDate.AddDays(-6),
                    UserId = "user-2-guid-67890",
                    State = "Approved",
                    ViewCount = random.Next(100, 500),
                    LikeCount = random.Next(20, 100),
                    DownloadCount = random.Next(5, 50),
                    Orientation = "landscape",
                    IsDeleted = false
                },
                new Photo
                {
                    PhotoId = 6,
                    Title = "City Skyline at Night",
                    Description = "Illuminated city skyline with reflections on water",
                    Url = "https://images.unsplash.com/photo-1449824913935-59a10b8d2000",
                    Slug = "city-skyline-night-678901",
                    Width = 2000,
                    Height = 1333,
                    Format = "jpg",
                    FileSize = 2800000,
                    UploadedAt = currentDate.AddDays(-4),
                    UserId = "user-3-guid-11111",
                    State = "Approved",
                    ViewCount = random.Next(100, 500),
                    LikeCount = random.Next(20, 100),
                    DownloadCount = random.Next(5, 50),
                    Orientation = "landscape",
                    IsDeleted = false
                },
                new Photo
                {
                    PhotoId = 7,
                    Title = "Minimalist Design",
                    Description = "Clean and simple minimalist composition",
                    Url = "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
                    Slug = "minimalist-design-789012",
                    Width = 1200,
                    Height = 1800,
                    Format = "jpg",
                    FileSize = 1400000,
                    UploadedAt = currentDate.AddDays(-3),
                    UserId = "user-1-guid-12345",
                    State = "Pending",
                    ViewCount = 0,
                    LikeCount = 0,
                    DownloadCount = 0,
                    Orientation = "portrait",
                    IsDeleted = false
                },
                new Photo
                {
                    PhotoId = 8,
                    Title = "Abstract Colors",
                    Description = "Vibrant abstract composition with flowing colors",
                    Url = "https://images.unsplash.com/photo-1541961017774-22349e4a1262",
                    Slug = "abstract-colors-890123",
                    Width = 1500,
                    Height = 1500,
                    Format = "jpg",
                    FileSize = 1900000,
                    UploadedAt = currentDate.AddDays(-2),
                    UserId = "user-2-guid-67890",
                    State = "Draft",
                    ViewCount = 0,
                    LikeCount = 0,
                    DownloadCount = 0,
                    Orientation = "square",
                    IsDeleted = false
                },
                new Photo
                {
                    PhotoId = 9,
                    Title = "Vintage Car",
                    Description = "Classic vintage car in perfect condition",
                    Url = "https://images.unsplash.com/photo-1552519507-da3b142c6e3d",
                    Slug = "vintage-car-901234",
                    Width = 1920,
                    Height = 1280,
                    Format = "jpg",
                    FileSize = 2300000,
                    UploadedAt = currentDate.AddDays(-1),
                    UserId = "user-3-guid-11111",
                    State = "Approved",
                    ViewCount = random.Next(100, 500),
                    LikeCount = random.Next(20, 100),
                    DownloadCount = random.Next(5, 50),
                    Orientation = "landscape",
                    IsDeleted = false
                },
                new Photo
                {
                    PhotoId = 10,
                    Title = "Fashion Portrait",
                    Description = "Professional fashion portrait with dramatic lighting",
                    Url = "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
                    Slug = "fashion-portrait-012345",
                    Width = 1200,
                    Height = 1600,
                    Format = "jpg",
                    FileSize = 2100000,
                    UploadedAt = currentDate,
                    UserId = "user-1-guid-12345",
                    State = "Approved",
                    ViewCount = random.Next(50, 200),
                    LikeCount = random.Next(10, 50),
                    DownloadCount = random.Next(2, 20),
                    Orientation = "portrait",
                    IsDeleted = false
                }
            };

            modelBuilder.Entity<Photo>().HasData(photos);

            // Seed PhotoTags
            SeedPhotoTags(modelBuilder);
        }

        private static void SeedPhotoTags(ModelBuilder modelBuilder)
        {
            var photoTags = new[]
            {
                // Photo 1 - Golden Hour Mountain View
                new PhotoTag { PhotoTagId = 1, PhotoId = 1, TagId = 5 }, // Landscape
                new PhotoTag { PhotoTagId = 2, PhotoId = 1, TagId = 1 }, // Nature
                new PhotoTag { PhotoTagId = 3, PhotoId = 1, TagId = 12 }, // Mountains
                new PhotoTag { PhotoTagId = 4, PhotoId = 1, TagId = 10 }, // Sunset

                // Photo 2 - Urban Architecture
                new PhotoTag { PhotoTagId = 5, PhotoId = 2, TagId = 2 }, // Architecture
                new PhotoTag { PhotoTagId = 6, PhotoId = 2, TagId = 6 }, // Urban
                new PhotoTag { PhotoTagId = 7, PhotoId = 2, TagId = 17 }, // Modern

                // Photo 3 - Ocean Waves
                new PhotoTag { PhotoTagId = 8, PhotoId = 3, TagId = 11 }, // Ocean
                new PhotoTag { PhotoTagId = 9, PhotoId = 3, TagId = 1 }, // Nature
                new PhotoTag { PhotoTagId = 10, PhotoId = 3, TagId = 5 }, // Landscape

                // Photo 4 - Street Art Portrait
                new PhotoTag { PhotoTagId = 11, PhotoId = 4, TagId = 4 }, // Street
                new PhotoTag { PhotoTagId = 12, PhotoId = 4, TagId = 8 }, // Art
                new PhotoTag { PhotoTagId = 13, PhotoId = 4, TagId = 18 }, // Colorful

                // Photo 5 - Forest Path
                new PhotoTag { PhotoTagId = 14, PhotoId = 5, TagId = 1 }, // Nature
                new PhotoTag { PhotoTagId = 15, PhotoId = 5, TagId = 5 }, // Landscape
                new PhotoTag { PhotoTagId = 16, PhotoId = 5, TagId = 7 }, // Travel

                // Photo 6 - City Skyline at Night
                new PhotoTag { PhotoTagId = 17, PhotoId = 6, TagId = 13 }, // City
                new PhotoTag { PhotoTagId = 18, PhotoId = 6, TagId = 6 }, // Urban
                new PhotoTag { PhotoTagId = 19, PhotoId = 6, TagId = 2 }, // Architecture

                // Photo 7 - Minimalist Design
                new PhotoTag { PhotoTagId = 20, PhotoId = 7, TagId = 15 }, // Minimalist
                new PhotoTag { PhotoTagId = 21, PhotoId = 7, TagId = 8 }, // Art
                new PhotoTag { PhotoTagId = 22, PhotoId = 7, TagId = 14 }, // Abstract

                // Photo 8 - Abstract Colors
                new PhotoTag { PhotoTagId = 23, PhotoId = 8, TagId = 14 }, // Abstract
                new PhotoTag { PhotoTagId = 24, PhotoId = 8, TagId = 18 }, // Colorful
                new PhotoTag { PhotoTagId = 25, PhotoId = 8, TagId = 8 }, // Art

                // Photo 9 - Vintage Car
                new PhotoTag { PhotoTagId = 26, PhotoId = 9, TagId = 16 }, // Vintage
                new PhotoTag { PhotoTagId = 27, PhotoId = 9, TagId = 7 }, // Travel

                // Photo 10 - Fashion Portrait
                new PhotoTag { PhotoTagId = 28, PhotoId = 10, TagId = 3 }, // Portrait
                new PhotoTag { PhotoTagId = 29, PhotoId = 10, TagId = 20 }, // Fashion
                new PhotoTag { PhotoTagId = 30, PhotoId = 10, TagId = 17 } // Modern
            };

            modelBuilder.Entity<PhotoTag>().HasData(photoTags);
        }

        private static void SeedReports(ModelBuilder modelBuilder)
        {
            var currentDate = DateTime.UtcNow;

            var reports = new[]
            {
                new Report
                {
                    ReportId = 1,
                    ReportTitle = "Inappropriate image content",
                    ReportMessage = "This image contains content that violates community guidelines. The subject matter is not suitable for public viewing.",
                    ReportedByUserId = "user-2-guid-67890", // Sedin reporting
                    ReportedUserId = "user-1-guid-12345", // Kerim being reported
                    PhotoId = 1,
                    ReportTypeId = 1, // Inappropriate Content
                    ReportStatusId = 2, // Under Review
                    CreatedAt = currentDate.AddDays(-5),
                    AdminNotes = "Under investigation by content team."
                },
                new Report
                {
                    ReportId = 2,
                    ReportTitle = "Copyright infringement",
                    ReportMessage = "This photo was taken from my portfolio without permission. I own the original copyright to this image.",
                    ReportedByUserId = "user-3-guid-11111", // Ana reporting
                    ReportedUserId = "user-2-guid-67890", // Sedin being reported
                    PhotoId = 2,
                    ReportTypeId = 2, // Copyright Violation
                    ReportStatusId = 3, // Resolved
                    CreatedAt = currentDate.AddDays(-4),
                    AdminNotes = "Copyright claim verified. Photo removed.",
                    AdminUserId = "user-2-guid-67890",
                    ResolvedAt = currentDate.AddDays(-3)
                },
                new Report
                {
                    ReportId = 3,
                    ReportTitle = "Stolen artwork",
                    ReportMessage = "This user has uploaded my artwork without crediting me or asking for permission.",
                    ReportedByUserId = "user-1-guid-12345", // Kerim reporting
                    ReportedUserId = "user-3-guid-11111", // Ana being reported
                    PhotoId = 4,
                    ReportTypeId = 8, // Stolen or Unauthorized Use
                    ReportStatusId = 1, // Pending
                    CreatedAt = currentDate.AddDays(-3)
                },
                new Report
                {
                    ReportId = 4,
                    ReportTitle = "Privacy violation",
                    ReportMessage = "This photo was taken of me without my consent and posted without permission.",
                    ReportedByUserId = "user-2-guid-67890", // Sedin reporting
                    ReportedUserId = "user-1-guid-12345", // Kerim being reported
                    PhotoId = 5,
                    ReportTypeId = 7, // Privacy Violation
                    ReportStatusId = 5, // Escalated
                    CreatedAt = currentDate.AddDays(-3),
                    AdminNotes = "Escalated to legal team for review."
                },
                new Report
                {
                    ReportId = 5,
                    ReportTitle = "Low quality spam",
                    ReportMessage = "This image is very low quality and seems to be uploaded just to spam the platform.",
                    ReportedByUserId = "user-3-guid-11111", // Ana reporting
                    ReportedUserId = "user-2-guid-67890", // Sedin being reported
                    PhotoId = 6,
                    ReportTypeId = 6, // Spam or Misleading
                    ReportStatusId = 4, // Dismissed
                    CreatedAt = currentDate.AddDays(-2),
                    AdminNotes = "Report dismissed - image quality acceptable.",
                    AdminUserId = "user-2-guid-67890",
                    ResolvedAt = currentDate.AddDays(-1)
                },
                new Report
                {
                    ReportId = 6,
                    ReportTitle = "Offensive content",
                    ReportMessage = "The content of this image promotes hate speech and discrimination against certain groups.",
                    ReportedByUserId = "user-1-guid-12345", // Kerim reporting
                    ReportedUserId = "user-3-guid-11111", // Ana being reported
                    PhotoId = 9,
                    ReportTypeId = 5, // Hate Speech or Discrimination
                    ReportStatusId = 3, // Resolved
                    CreatedAt = currentDate.AddDays(-2),
                    AdminNotes = "Content removed for policy violation.",
                    AdminUserId = "user-2-guid-67890",
                    ResolvedAt = currentDate.AddDays(-1)
                },
                new Report
                {
                    ReportId = 7,
                    ReportTitle = "Graphic violent content",
                    ReportMessage = "This image contains graphic violence that should not be displayed on this platform.",
                    ReportedByUserId = "user-2-guid-67890", // Sedin reporting
                    ReportedUserId = "user-1-guid-12345", // Kerim being reported
                    PhotoId = 3,
                    ReportTypeId = 4, // Violence or Graphic Content
                    ReportStatusId = 5, // In Progress
                    CreatedAt = currentDate.AddDays(-1),
                    AdminNotes = "Reviewing content for policy compliance."
                },
                new Report
                {
                    ReportId = 8,
                    ReportTitle = "Nudity violation",
                    ReportMessage = "This photo contains nudity which violates the platform's content policy.",
                    ReportedByUserId = "user-3-guid-11111", // Ana reporting
                    ReportedUserId = "user-2-guid-67890", // Sedin being reported
                    PhotoId = 10,
                    ReportTypeId = 3, // Nudity or Sexual Content
                    ReportStatusId = 1, // Pending
                    CreatedAt = currentDate.AddHours(-12)
                },
                new Report
                {
                    ReportId = 9,
                    ReportTitle = "Irrelevant content",
                    ReportMessage = "This image doesn't belong on a photography platform. It's completely irrelevant to the site's purpose.",
                    ReportedByUserId = "user-1-guid-12345", // Kerim reporting
                    ReportedUserId = "user-3-guid-11111", // Ana being reported
                    PhotoId = 7,
                    ReportTypeId = 9, // Low Quality or Irrelevant
                    ReportStatusId = 4, // Dismissed
                    CreatedAt = currentDate.AddHours(-6),
                    AdminNotes = "Content is relevant to platform.",
                    AdminUserId = "user-2-guid-67890",
                    ResolvedAt = currentDate.AddHours(-3)
                },
                new Report
                {
                    ReportId = 10,
                    ReportTitle = "Multiple policy violations",
                    ReportMessage = "This image violates multiple community guidelines including inappropriate content and privacy violations.",
                    ReportedByUserId = "user-2-guid-67890", // Sedin reporting
                    ReportedUserId = "user-1-guid-12345", // Kerim being reported
                    PhotoId = 8,
                    ReportTypeId = 10, // Other
                    ReportStatusId = 5, // Awaiting User Response
                    CreatedAt = currentDate.AddHours(-2)
                }
            };

            modelBuilder.Entity<Report>().HasData(reports);
        }

        public static void SeedRoles(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<IdentityRole>().HasData(
                new IdentityRole
                {
                    Id = "admin-role-guid-1",
                    Name = "Admin",
                    NormalizedName = "ADMIN",
                    ConcurrencyStamp = Guid.NewGuid().ToString()
                },
                new IdentityRole
                {
                    Id = "user-role-guid-2",
                    Name = "User",
                    NormalizedName = "USER",
                    ConcurrencyStamp = Guid.NewGuid().ToString()
                }
            );

            // Assign roles to users
            modelBuilder.Entity<IdentityUserRole<string>>().HasData(
                new IdentityUserRole<string>
                {
                    UserId = "user-1-guid-12345",
                    RoleId = "user-role-guid-2"
                },
                new IdentityUserRole<string>
                {
                    UserId = "user-2-guid-67890",
                    RoleId = "admin-role-guid-1"
                },
                new IdentityUserRole<string>
                {
                    UserId = "user-3-guid-11111",
                    RoleId = "user-role-guid-2"
                }
            );
        }
    }
}