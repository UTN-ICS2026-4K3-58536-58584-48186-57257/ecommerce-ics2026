using Dsw2025Tpi.Application.Dtos;
using Dsw2025Tpi.Application.Services.Interfaces;
using Dsw2025Tpi.Application.Exceptions;
using Dsw2025Tpi.Application.Constants;
using Dsw2025Tpi.Domain.Entities;
using Microsoft.EntityFrameworkCore;


namespace Dsw2025Tpi.Application.Services;

public class ProductManagementService : IProductManagementService
{
    private readonly Dsw2025TpiContext _context;

    public ProductManagementService(Dsw2025TpiContext context)
    {
        _context = context;
    }

    // Crear productos
    public async Task<ProductModel.ProductResponse> CreateProductAsync(ProductModel.ProductRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Sku))
            throw new BusinessException(ErrorMessages.SkuRequired);

        if (string.IsNullOrWhiteSpace(request.Name))
            throw new BusinessException(ErrorMessages.NameRequired);

        if (request.CurrentUnitPrice <= 0)
            throw new BusinessException(ErrorMessages.PriceMustBePositive);

        if (request.StockQuantity < 0)
            throw new BusinessException(ErrorMessages.StockCannotBeNegative);

        var exists = await _context.Products.AnyAsync(p => p.Sku == request.Sku);
        if (exists)
            throw new BusinessException(ErrorMessages.SkuAlreadyExists);

        var product = new Product
        {
            Id = Guid.NewGuid(),
            Sku = request.Sku,
            InternalCode = request.InternalCode,
            Name = request.Name,
            Description = request.Description,
            CurrentUnitPrice = request.CurrentUnitPrice,
            StockQuantity = request.StockQuantity,
            IsActive = true
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return new ProductModel.ProductResponse(
            product.Id,
            product.Sku,
            product.InternalCode,
            product.Name,
            product.Description,
            product.CurrentUnitPrice,
            product.StockQuantity,
            product.IsActive
        );
    }

    // Obtener todos los productos
    public async Task<PagedResult<ProductModel.ProductResponse>> GetAllProductsAsync(
      string? searchTerm,
      string? status,
      int pageNumber,
      int pageSize)
    {
        var query = _context.Products.AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            query = query.Where(p => p.Name.Contains(searchTerm) || p.Sku.Contains(searchTerm));
        }

        if (!string.IsNullOrWhiteSpace(status) && status != "all")
        {
            bool isActive = status.ToLower() == "enabled";
            query = query.Where(p => p.IsActive == isActive);
        }

        var total = await query.CountAsync();
        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new ProductModel.ProductResponse(
                    p.Id,
                    p.Sku,
                    p.InternalCode,
                    p.Name,
                    p.Description,
                    p.CurrentUnitPrice,
                    p.StockQuantity,
                    p.IsActive
            ))
            .ToListAsync();

        return new PagedResult<ProductModel.ProductResponse>
        {
            Total = total,
            Items = items
        };
    }

    // Obtener todos los productos admini
    public async Task<PagedResult<ProductModel.ProductResponse>> GetAllProductsAdminAsync(ProductModel.FilterProduct filter)
    {
        var query = _context.Products.AsQueryable();

        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            query = query.Where(p =>
                p.Name.Contains(filter.Search) ||
                p.Sku.Contains(filter.Search));
        }

        if (!string.IsNullOrWhiteSpace(filter.Status) && filter.Status != "all")
        {
            bool isActive = filter.Status.ToLower() == "enabled";
            query = query.Where(p => p.IsActive == isActive);
        }

        var total = await query.CountAsync();

        var items = await query
            .Skip(((filter.PageNumber ?? 1) - 1) * (filter.PageSize ?? 10))
            .Take(filter.PageSize ?? 10)
            .Select(p => new ProductModel.ProductResponse(
                p.Id,
                p.Sku,
                p.InternalCode,
                p.Name,
                p.Description,
                p.CurrentUnitPrice,
                p.StockQuantity,
                p.IsActive
            ))
            .ToListAsync();

        return new PagedResult<ProductModel.ProductResponse>
        {
            Total = total,
            Items = items
        };
    }



    // Obtener producto por ID
    public async Task<ProductModel.ProductResponse> GetProductByIdAsync(Guid id)
    {
        var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id && p.IsActive);
        if (product == null)
            throw new KeyNotFoundException(ErrorMessages.ProductNotFound);

        return new ProductModel.ProductResponse(
            product.Id,
            product.Sku,
            product.InternalCode,
            product.Name,
            product.Description,
            product.CurrentUnitPrice,
            product.StockQuantity,
            product.IsActive
        );
    }

    // Actualizar un producto
    public async Task<ProductModel.ProductResponse> UpdateProductAsync(Guid id, ProductModel.ProductRequest request)
    {
        var exists = await _context.Products.AnyAsync(p => p.Sku == request.Sku && p.Id != id);
        if (exists)
            throw new BusinessException(ErrorMessages.SkuAlreadyExists);

        if (string.IsNullOrWhiteSpace(request.Sku))
            throw new BusinessException(ErrorMessages.SkuRequired);

        if (string.IsNullOrWhiteSpace(request.Name))
            throw new BusinessException(ErrorMessages.NameRequired);

        if (request.CurrentUnitPrice <= 0)
            throw new BusinessException(ErrorMessages.PriceMustBePositive);

        if (request.StockQuantity < 0)
            throw new BusinessException(ErrorMessages.StockCannotBeNegative);

        var product = await _context.Products.FindAsync(id);
        if (product == null || !product.IsActive)
            throw new KeyNotFoundException(ErrorMessages.ProductNotFound);

        product.Sku = request.Sku;
        product.InternalCode = request.InternalCode;
        product.Name = request.Name;
        product.Description = request.Description;
        product.CurrentUnitPrice = request.CurrentUnitPrice;
        product.StockQuantity = request.StockQuantity;

        await _context.SaveChangesAsync();

        return new ProductModel.ProductResponse(
            product.Id,
            product.Sku,
            product.InternalCode,
            product.Name,
            product.Description,
            product.CurrentUnitPrice,
            product.StockQuantity,
            product.IsActive
        );
    }

    // Inhabilitar un producto
    public async Task DisableProductAsync(Guid id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
            throw new KeyNotFoundException(ErrorMessages.ProductNotFound);

        product.IsActive = false;
        await _context.SaveChangesAsync();
    }
}
