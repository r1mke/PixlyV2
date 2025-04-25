namespace Pixly.Services.Database
{
    public class Favorite
    {
        public int FavoriteId { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }

        public int PhotoId { get; set; }
        public Photo Photo { get; set; }

        public DateTime FavoritedAt { get; set; } = DateTime.UtcNow;
    }
}