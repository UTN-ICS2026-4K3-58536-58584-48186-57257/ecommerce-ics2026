namespace Dsw2025Tpi.Application.Dtos;

public class PagedResult<T>
{
    public int Total { get; set; }
    public IEnumerable<T> Items { get; set; } = new List<T>();
}