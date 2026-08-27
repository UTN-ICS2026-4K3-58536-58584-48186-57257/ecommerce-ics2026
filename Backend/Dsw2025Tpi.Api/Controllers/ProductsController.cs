using Dsw2025Tpi.Application.Services.Interfaces;
using Dsw2025Tpi.Application.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Dsw2025Tpi.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductManagementService _service;

    public ProductsController(IProductManagementService service)
    {
        _service = service;
    }

    // Crear un producto
    [Authorize(Roles = "admin")]
    [HttpPost]
    public async Task<IActionResult> CreateProduct([FromBody] ProductModel.ProductRequest request)
    {
        var created = await _service.CreateProductAsync(request);
        return CreatedAtAction(nameof(GetProductById), new { id = created.Id }, created);
    }

    // Obtener todos los productos
    [HttpGet]
    public async Task<IActionResult> GetAllProducts(
    [FromQuery] string? searchTerm,
    [FromQuery] string? status,
    [FromQuery] int pageNumber = 1,
    [FromQuery] int pageSize = 8)
    {
        var result = await _service.GetAllProductsAsync(searchTerm, status, pageNumber, pageSize);
        return Ok(result);
    }

    // Obtener todos los productos desde admin
    [Authorize(Roles = "admin")]
    [HttpGet("admin")]
    public async Task<IActionResult> GetProductsAdmin(
        [FromQuery] string? searchTerm,
        [FromQuery] string? status,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
        var filter = new ProductModel.FilterProduct(
            status,         // Status
            searchTerm,     // Search
            pageNumber,     // PageNumber
            pageSize        // PageSize
        );

        var result = await _service.GetAllProductsAdminAsync(filter);

        return Ok(result);
    }




    // Obtener un producto por ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetProductById(Guid id)
    {
        var product = await _service.GetProductByIdAsync(id);
        return Ok(product); 
    }

    // Actualizar un producto
    [Authorize(Roles = "admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(Guid id, [FromBody] ProductModel.ProductRequest product)
    {
        
        var updated = await _service.UpdateProductAsync(id, product);
        return Ok(updated); 
    }

    // Inhabilitar un producto
    [Authorize(Roles = "admin")]
    [HttpPatch("{id}")]
    public async Task<IActionResult> DisableProduct(Guid id)
    {
        await _service.DisableProductAsync(id);
        return NoContent(); 
    }
}

