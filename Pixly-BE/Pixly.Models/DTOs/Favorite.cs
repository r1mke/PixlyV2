namespace Pixly.Models.DTOs
{
    public class Favorite
    {
        public int UserId { get; set; }
        public int PhotoId { get; set; }
        public DateTime FavoritedAt { get; set; }
    }
}
