using Microsoft.AspNetCore.Mvc;
using Pixly.API.Exstensions;
using Pixly.Models.DTOs;
using Pixly.Services.Helper;
using Pixly.Services.Interfaces;

namespace Pixly.API.Controllers
{

    [ApiController]
    public class CRUDController<TModel, TSearch, TInsert, TUpdate> : ControllerBase
    {

        protected ICRUDService<TModel, TSearch, TInsert, TUpdate> _service;

        public CRUDController(ICRUDService<TModel, TSearch, TInsert, TUpdate> service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<PagedList<TModel>>>> GetPaged([FromQuery] TSearch search)
        {
            var pagedResult = await _service.GetPaged(search);

            Response.AddPaginationHeader(
                pagedResult.CurrentPage,
                pagedResult.PageSize,
                pagedResult.TotalCount,
                pagedResult.TotalPages
                );

            return this.ApiSuccess(pagedResult);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<TModel>>> GetById(int id)
        {
            var result = await _service.GetById(id);

            if (result == null) return this.ApiNotFound<TModel>($"Resource with ID {id} not found");
            return this.ApiSuccess(result);
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<TModel>>> Insert(TInsert request)
        {
            var result = await _service.Insert(request);

            if (result == null) return this.ApiBadRequest<TModel>();
            return this.ApiSuccess(result);
        }

        [HttpPatch("id")]
        public async Task<ActionResult<ApiResponse<TModel>>> Update(int id, TUpdate request)
        {
            var result = await _service.Update(id, request);

            if (result == null) return this.ApiBadRequest<TModel>();
            return this.ApiSuccess(result);
        }
    }
}
