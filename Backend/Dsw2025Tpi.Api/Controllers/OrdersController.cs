using Dsw2025Tpi.Application.Dtos;
using Dsw2025Tpi.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Dsw2025Tpi.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderManagementService _orderService;

    public OrdersController(IOrderManagementService orderService)
    {
        _orderService = orderService;
    }

    //Crear una orden
    [Authorize(Roles = "customer")]
    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] OrderModel.OrderRequest request)
    {
        var created = await _orderService.CreateOrderAsync(request);
        return CreatedAtAction(nameof(GetOrderById), new { id = created.Id }, created);
    }

    //Listar todas las órdenes
    [Authorize(Roles = "admin, customer")]
    [HttpGet]
    public async Task<IActionResult> GetAllOrders(
        [FromQuery] string? status,
        [FromQuery] Guid? customerId,
        [FromQuery] string? searchTerm, // <--- Nuevo parámetro para búsqueda
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
        var result = await _orderService.GetAllOrdersAsync(status, customerId, searchTerm, pageNumber, pageSize);
        return Ok(result);
    }

    //Obtener una orden por ID
    [Authorize(Roles = "customer,admin")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetOrderById(Guid id)
    {
        var order = await _orderService.GetOrderByIdAsync(id);
        return Ok(order);
    }

    //Actualizar el estado de una orden
    [Authorize(Roles = "admin")]
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateOrderStatus(Guid id, [FromBody] OrderModel.UpdateStatusRequest request)
    {
        var updated = await _orderService.UpdateOrderStatusAsync(id, request);
        return Ok(updated); 
    }
}