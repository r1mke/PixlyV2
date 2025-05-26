using Microsoft.AspNetCore.Mvc;
using Pixly.API.Exstensions;
using Pixly.Models.DTOs;
using Pixly.Services.Helper;
using Pixly.Services.Interfaces;

namespace Pixly.API.Controllers
{

    [ApiController]
    public class CRUDController<TModelDetail, TModelBasic, TSearch, TInsert, TUpdate, TId> : ControllerBase
    {

        protected ICRUDService<TModelDetail, TModelBasic, TSearch, TInsert, TUpdate, TId> _service;

        public CRUDController(ICRUDService<TModelDetail, TModelBasic, TSearch, TInsert, TUpdate, TId> service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<PagedList<TModelBasic>>>> GetPaged([FromQuery] TSearch search)
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
        public async Task<ActionResult<ApiResponse<TModelDetail>>> GetById(TId id)
        {
            var result = await _service.GetById(id);

            if (result == null) return this.ApiNotFound<TModelDetail>($"Resource with ID {id} not found");
            return this.ApiSuccess(result);
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<TModelBasic>>> Insert(TInsert request)
        {
            var result = await _service.Insert(request);

            if (result == null) return this.ApiBadRequest<TModelBasic>();
            return this.ApiSuccess(result);
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult<ApiResponse<TModelBasic>>> Update(TId id, TUpdate request)
        {
            var result = await _service.Update(id, request);

            if (result == null) return this.ApiBadRequest<TModelBasic>();
            return this.ApiSuccess(result);
        }
    }
}
