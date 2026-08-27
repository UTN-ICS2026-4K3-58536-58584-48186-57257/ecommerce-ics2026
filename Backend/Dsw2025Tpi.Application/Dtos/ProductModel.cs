namespace Dsw2025Tpi.Application.Dtos;

public record ProductModel
{
    public record ProductRequest(string Sku, string InternalCode, string Name, string Description, decimal CurrentUnitPrice, int StockQuantity);

    public record ProductResponse(Guid Id, string Sku, string InternalCode, string Name, string Description, decimal CurrentUnitPrice, int StockQuantity, bool IsActive);
    public record ResponsePagination(List<ProductResponse> ProductItems, int Total);
    public record FilterProduct(string? Status, string? Search, int? PageNumber, int? PageSize);
}

