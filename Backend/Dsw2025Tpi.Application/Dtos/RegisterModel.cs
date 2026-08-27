namespace Dsw2025Tpi.Application.Dtos;

public record RegisterModel
{
    public record RegisterRequest(string Username, string Email, string Password, string Role);

    public record RegisterResponse(string UserId, string Username, string Email, string Role, Guid? CustomerId);
}
