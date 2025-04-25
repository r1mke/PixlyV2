using Microsoft.AspNetCore.Mvc;
using Pixly.Services.Interfaces;

namespace Pixly.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CRUDController<TModel, TSearch, TInsert, TUpdate> : ControllerBase
    {

        protected ICRUDService<TModel, TSearch, TInsert, TUpdate> _service;

        public CRUDController(ICRUDService<TModel, TSearch, TInsert, TUpdate> service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<TModel>>> GetPaged([FromQuery] TSearch search)
        {
            var result = await _service.GetPaged(search);

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TModel>> GetById(int id)
        {
            var result = await _service.GetById(id);

            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<TModel>> Insert(TInsert request)
        {
            var result = await _service.Insert(request);

            if (result == null) return BadRequest("Failed to create the resource.");
            return Ok(result);
        }

        [HttpPatch("id")]
        public async Task<ActionResult<TModel>> Update(int id, TUpdate request)
        {
            var result = await _service.Update(id, request);

            if (result == null) return BadRequest("Failed to create the resource.");
            return Ok(result);
        }
    }
}
