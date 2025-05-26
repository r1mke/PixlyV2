using Microsoft.AspNetCore.Mvc;
using Pixly.Models.DTOs;
using Pixly.Models.SearchRequest;
using Pixly.Models.UpdateRequest;
using Pixly.Services.Interfaces;

namespace Pixly.API.Controllers
{
    [Route("api/user")]
    public class UserController : CRUDController<Models.DTOs.User, User, UserSearchRequest, User, UserUpdateRequest, string>
    {
        public UserController(IUserService service) : base(service)
        {

        }
    }
}
