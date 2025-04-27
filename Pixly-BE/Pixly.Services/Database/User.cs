namespace Pixly.Services.Database
{
    public class User
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string? PasswordSalt { get; set; }
        public string? PasswordHash { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string? ProfilePictureUrl { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? State { get; set; }
        public bool isDeleted { get; set; } = false;
        public ICollection<Photo> Photos { get; set; } = new List<Photo>();
        public ICollection<Like> Likes { get; set; } = new List<Like>();
        public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
        public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    }
}
