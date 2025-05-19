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
            SeedTags(modelBuilder);
            SeedPhotos(modelBuilder);
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

        public static void SeedPhotos(ModelBuilder modelBuilder)
        {

            var random = new Random();
            var currentDate = DateTime.UtcNow;
            string[] slugs = GenerateSlugs(20);

            var photos = new List<Photo>();


            photos.Add(CreatePhoto(1, "Urban Landscape at Night", "A stunning cityscape with illuminated buildings at night",
                "https://res.cloudinary.com/dkplibgol/image/upload/v1747487348/Pixly/pexels-roodzn-31731013.jpg",
                slugs[0], 1920, 1080, "jpg", 2500000, currentDate.AddDays(-10), "1", "Approved", "landscape"));

            photos.Add(CreatePhoto(2, "Abstract Architecture", "Modern building with unique architectural features",
                "https://res.cloudinary.com/dkplibgol/image/upload/v1747487435/Pixly/pexels-blak7ta-31969691.jpg",
                slugs[1], 2000, 3000, "jpg", 3200000, currentDate.AddDays(-9), "1", "Approved", "portrait"));

            photos.Add(CreatePhoto(3, "Mountain Landscape", "Majestic mountain range with snow-capped peaks",
                "https://res.cloudinary.com/dkplibgol/image/upload/v1747515588/Pixly/pexels-riccardo-toso-2151342566-31630076.jpg",
                slugs[2], 2400, 1600, "jpg", 4100000, currentDate.AddDays(-8), "1", "Approved", "landscape"));

            photos.Add(CreatePhoto(4, "Beach Sunset", "Beautiful sunset view over the ocean",
                "https://res.cloudinary.com/dkplibgol/image/upload/v1747487464/Pixly/pexels-marina-endzhirgli-725723515-31449901.jpg",
                slugs[3], 2200, 1400, "jpg", 2800000, currentDate.AddDays(-7), "2", "Approved", "landscape"));

            photos.Add(CreatePhoto(5, "Urban Street Art", "Colorful graffiti on city wall",
                "https://res.cloudinary.com/dkplibgol/image/upload/v1747516069/Pixly/pexels-oz-art-266259698-27658797.jpg",
                slugs[4], 1800, 2700, "jpg", 3500000, currentDate.AddDays(-6), "2", "Approved", "portrait"));

            photos.Add(CreatePhoto(6, "Forest Path", "Serene walking path through dense forest",
                "https://res.cloudinary.com/dkplibgol/image/upload/v1747487409/Pixly/pexels-miff-ibra-387362143-31212418.jpg",
                slugs[5], 2100, 1400, "jpg", 2900000, currentDate.AddDays(-5), "1", "Approved", "landscape"));

            photos.Add(CreatePhoto(7, "Spring Flowers", "Closeup of colorful spring blooms",
                "https://res.cloudinary.com/dkplibgol/image/upload/v1747565066/Pixly/20230420133522_IMG_1465.jpg",
                slugs[6], 1600, 1600, "jpg", 2200000, currentDate.AddDays(-4), "2", "Approved", "square"));

            photos.Add(CreatePhoto(8, "Ancient Architecture", "Historic building with ornate details",
                "https://res.cloudinary.com/dkplibgol/image/upload/v1747565125/Pixly/20230420122643_IMG_1253.jpg",
                slugs[7], 1900, 1200, "jpg", 2600000, currentDate.AddDays(-4), "1", "Approved", "landscape"));

            photos.Add(CreatePhoto(9, "Wildlife Portrait", "Close-up of a wild animal in natural habitat",
                "https://res.cloudinary.com/dkplibgol/image/upload/v1747565167/Pixly/20230420130548_IMG_1329.jpg",
                slugs[8], 2000, 1500, "jpg", 3000000, currentDate.AddDays(-3), "2", "Approved", "landscape"));

            photos.Add(CreatePhoto(10, "Morning Fog", "Misty landscape at dawn",
                "https://res.cloudinary.com/dkplibgol/image/upload/v1747565212/Pixly/20230420123247_IMG_1285.jpg",
                slugs[9], 2400, 1600, "jpg", 3400000, currentDate.AddDays(-3), "1", "Approved", "landscape"));

            photos.Add(CreatePhoto(11, "Urban Exploration", "Abandoned industrial site with unique textures",
                "https://res.cloudinary.com/dkplibgol/image/upload/v1747565257/Pixly/20230420123654_IMG_1293.jpg",
                slugs[10], 1800, 2700, "jpg", 3800000, currentDate.AddDays(-2), "2", "Approved", "portrait"));

            photos.Add(CreatePhoto(12, "Northern Lights", "Aurora borealis over snowy landscape",
                "https://res.cloudinary.com/dkplibgol/image/upload/v1747565289/Pixly/20230420130449_IMG_1320.jpg",
                slugs[11], 2200, 1400, "jpg", 3100000, currentDate.AddDays(-2), "1", "Approved", "landscape"));

            photos.Add(CreatePhoto(13, "Desert Landscape", "Sandy dunes under clear blue sky",
                "https://res.cloudinary.com/dkplibgol/image/upload/v1747565343/Pixly/20230420121826_IMG_1202.jpg",
                slugs[12], 2000, 1333, "jpg", 2700000, currentDate.AddDays(-1), "2", "Approved", "landscape"));

            photos.Add(CreatePhoto(14, "Reflections", "Mountain landscape mirrored in still lake water",
                "https://res.cloudinary.com/dkplibgol/image/upload/v1747487292/Pixly/pexels-melike-baran-407276327-32080139.jpg",
                slugs[13], 2100, 1400, "jpg", 2900000, currentDate.AddDays(-1), "1", "Approved", "landscape"));

            photos.Add(CreatePhoto(15, "Cityscape", "Panoramic view of a modern city skyline",
                "https://res.cloudinary.com/dkplibgol/image/upload/v1747565432/Pixly/pexels-davdkuko-27738667.jpg",
                slugs[14], 2400, 1200, "jpg", 3200000, currentDate, "2", "Approved", "landscape"));

            photos.Add(CreatePhoto(16, "Macro Nature", "Extreme close-up of natural elements",
                "https://res.cloudinary.com/dkplibgol/image/upload/v1747565452/Pixly/pexels-daniel-gubo-2150904441-31388903.jpg",
                slugs[15], 1600, 1600, "jpg", 2400000, currentDate, "1", "Approved", "square"));

            photos.Add(CreatePhoto(17, "Minimalist Architecture", "Clean lines and simple shapes of modern building",
                "https://res.cloudinary.com/dkplibgol/image/upload/v1747565500/Pixly/pexels-jean-daniel-31737021.jpg",
                slugs[16], 1800, 2700, "jpg", 3500000, currentDate, "2", "Approved", "portrait"));

            photos.Add(CreatePhoto(18, "Aerial View", "Drone shot of landscape from above",
                "https://res.cloudinary.com/dkplibgol/image/upload/v1747565521/Pixly/pexels-ebrart-p-748409988-31587340.jpg",
                slugs[17], 2200, 1500, "jpg", 3300000, currentDate, "1", "Approved", "landscape"));

            photos.Add(CreatePhoto(19, "Street Photography", "Candid urban scene with interesting composition",
                "https://res.cloudinary.com/dkplibgol/image/upload/v1747487355/Pixly/pexels-luis-dv-1453683203-31747630.jpg",
                slugs[18], 1900, 2800, "jpg", 3700000, currentDate, "2", "Approved", "portrait"));

            photos.Add(CreatePhoto(20, "Golden Hour Portrait", "Person photographed during sunset light",
                "https://res.cloudinary.com/dkplibgol/image/upload/v1747487366/Pixly/pexels-ibrahim-can-duran-562239220-31675650.jpg",
                slugs[19], 2000, 3000, "jpg", 3900000, currentDate, "1", "Approved", "portrait"));

            modelBuilder.Entity<Photo>().HasData(photos);

            var photoTags = new List<PhotoTag>();
            int photoTagId = 1;


            AddPhotoTags(photoTags, 1, new[] { 1, 5, 9, 12 }, ref photoTagId);  // Urban, Digital Art, Art, Innovation
            AddPhotoTags(photoTags, 2, new[] { 5, 8, 12, 14 }, ref photoTagId); // Digital Art, Art, Innovation, Generative Art
            AddPhotoTags(photoTags, 3, new[] { 8, 9, 13, 14 }, ref photoTagId); // Art, Art, Futuristic, Generative Art
            AddPhotoTags(photoTags, 4, new[] { 8, 9, 10, 14 }, ref photoTagId); // Art, Art, Creative AI, Generative Art
            AddPhotoTags(photoTags, 5, new[] { 5, 8, 9, 10 }, ref photoTagId);  // Digital Art, Art, Art, Creative AI
            AddPhotoTags(photoTags, 6, new[] { 8, 9, 14, 15 }, ref photoTagId); // Art, Art, Generative Art, Augmented Reality
            AddPhotoTags(photoTags, 7, new[] { 7, 8, 9, 10 }, ref photoTagId);  // Photo Enhancement, Art, Art, Creative AI
            AddPhotoTags(photoTags, 8, new[] { 6, 7, 8, 9 }, ref photoTagId);   // Computer Vision, Photo Enhancement, Art, Art
            AddPhotoTags(photoTags, 9, new[] { 4, 6, 7, 9 }, ref photoTagId);   // Image Generation, Computer Vision, Photo Enhancement, Art
            AddPhotoTags(photoTags, 10, new[] { 4, 7, 9, 14 }, ref photoTagId); // Image Generation, Photo Enhancement, Art, Generative Art
            AddPhotoTags(photoTags, 11, new[] { 4, 5, 9, 10 }, ref photoTagId); // Image Generation, Digital Art, Art, Creative AI
            AddPhotoTags(photoTags, 12, new[] { 4, 8, 13, 14 }, ref photoTagId); // Image Generation, Art, Futuristic, Generative Art
            AddPhotoTags(photoTags, 13, new[] { 1, 4, 9, 14 }, ref photoTagId); // AI, Image Generation, Art, Generative Art
            AddPhotoTags(photoTags, 14, new[] { 1, 2, 4, 14 }, ref photoTagId); // AI, Machine Learning, Image Generation, Generative Art
            AddPhotoTags(photoTags, 15, new[] { 1, 2, 3, 4 }, ref photoTagId);  // AI, Machine Learning, Deep Learning, Image Generation
            AddPhotoTags(photoTags, 16, new[] { 2, 3, 6, 7 }, ref photoTagId);  // Machine Learning, Deep Learning, Computer Vision, Photo Enhancement
            AddPhotoTags(photoTags, 17, new[] { 3, 6, 9, 12 }, ref photoTagId); // Deep Learning, Computer Vision, Art, Innovation
            AddPhotoTags(photoTags, 18, new[] { 4, 9, 14, 15 }, ref photoTagId); // Image Generation, Art, Generative Art, Augmented Reality
            AddPhotoTags(photoTags, 19, new[] { 5, 8, 9, 10 }, ref photoTagId); // Digital Art, Art, Art, Creative AI
            AddPhotoTags(photoTags, 20, new[] { 7, 8, 9, 11 }, ref photoTagId); // Photo Enhancement, Art, Art, Automation


            modelBuilder.Entity<PhotoTag>().HasData(photoTags);
        }

        private static Photo CreatePhoto(
            int photoId,
            string title,
            string description,
            string url,
            string slug,
            int width,
            int height,
            string format,
            long fileSize,
            DateTime uploadedAt,
            string userId,
            string state,
            string orientation)
        {
            return new Photo
            {
                PhotoId = photoId,
                Title = title,
                Description = description,
                Url = url,
                Slug = slug,
                Width = width,
                Height = height,
                Format = format,
                FileSize = fileSize,
                UploadedAt = uploadedAt,
                UserId = userId,
                State = state,
                ViewCount = new Random().Next(50, 1000),
                LikeCount = new Random().Next(10, 200),
                DownloadCount = new Random().Next(5, 100),
                Orientation = orientation,
                IsDeleted = false
            };
        }

        private static void AddPhotoTags(List<PhotoTag> photoTags, int photoId, int[] tagIds, ref int photoTagId)
        {
            foreach (var tagId in tagIds)
            {
                photoTags.Add(new PhotoTag
                {
                    PhotoTagId = photoTagId++,
                    PhotoId = photoId,
                    TagId = tagId
                });
            }
        }

        private static string[] GenerateSlugs(int count)
        {
            var slugs = new string[count];
            var rand = new Random();

            for (int i = 0; i < count; i++)
            {
                int randomNumber = rand.Next(100000, 1000000);
                slugs[i] = $"photo-title-{i + 1}-{randomNumber}";
            }

            return slugs;
        }


    }
}
