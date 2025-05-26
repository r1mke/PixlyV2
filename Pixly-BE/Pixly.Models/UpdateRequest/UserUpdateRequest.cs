using Microsoft.AspNetCore.Http;

namespace Pixly.Models.UpdateRequest
{
    public class UserUpdateRequest
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? UserName { get; set; }
        public bool RemoveProfilePicture { get; set; } = false;
        public IFormFile? ProfilePictureUrl { get; set; }
    }
}
