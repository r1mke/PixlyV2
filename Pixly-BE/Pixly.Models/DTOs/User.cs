namespace Pixly.Models.DTOs
{
    public class User
    {
        public string Username { get; set; }

        public string Email { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string? State { get; set; }
        public bool? isDeleted { get; set; }

        public ICollection<Photo> Photos { get; set; } = new List<Photo>();

        public ICollection<Like> Likes { get; set; } = new List<Like>();

        //public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
        //public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();

    }
}
