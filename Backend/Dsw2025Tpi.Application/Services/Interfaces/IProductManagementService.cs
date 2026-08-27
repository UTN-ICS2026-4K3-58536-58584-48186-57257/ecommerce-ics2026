using Dsw2025Tpi.Application.Dtos;
namespace Dsw2025Tpi.Application.Services.Interfaces;

public interface IProductManagementService
{
    Task<ProductModel.ProductResponse> CreateProductAsync(ProductModel.ProductRequest request);
    Task<PagedResult<ProductModel.ProductResponse>> GetAllProductsAsync(string? searchTerm, string? status, int pageNumber, int pageSize);
    Task<PagedResult<ProductModel.ProductResponse>> GetAllProductsAdminAsync(ProductModel.FilterProduct filter);
    Task<ProductModel.ProductResponse> GetProductByIdAsync(Guid id);
    Task<ProductModel.ProductResponse> UpdateProductAsync(Guid id, ProductModel.ProductRequest request);
    Task DisableProductAsync(Guid id);
}



