namespace Pixly.Models.DTOs
{
    public class User
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? ProfilePictureUrl { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? State { get; set; }
        public bool IsDeleted { get; set; } = false;
        public bool IsActive { get; set; } = true;

        //public ICollection<Photo> Photos { get; set; } = new List<Photo>();

        //public ICollection<Like> Likes { get; set; } = new List<Like>();

        //public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
        //public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();

    }
}
