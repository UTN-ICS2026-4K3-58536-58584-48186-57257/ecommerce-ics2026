using System.Threading.Tasks;
using Dsw2025Tpi.Application.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace Dsw2025Tpi.Application.Services.Interfaces
{
    public interface IOrderManagementService
    {
        Task<OrderModel.OrderResponse> CreateOrderAsync(OrderModel.OrderRequest request);
        Task<PagedResult<OrderModel.OrderResponse>> GetAllOrdersAsync(string? Status, Guid? CustomerId, string? SearchTerm, int PageNumber = 1, int PageSize = 10);
        Task<OrderModel.OrderResponse> GetOrderByIdAsync(Guid id);
        Task<OrderModel.OrderResponse> UpdateOrderStatusAsync(Guid id, OrderModel.UpdateStatusRequest request);
    }
}
