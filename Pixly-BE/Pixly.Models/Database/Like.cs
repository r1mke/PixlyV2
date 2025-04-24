namespace Pixly.Models.Database
{
    public class Like
    {
        public int LikeId { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }

        public int PhotoId { get; set; }
        public Photo Photo { get; set; }

        public DateTime LikedAt { get; set; } = DateTime.UtcNow;
    }
}