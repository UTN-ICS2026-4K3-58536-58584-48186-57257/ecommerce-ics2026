namespace Dsw2025Tpi.Application.Dtos;

public record LoginModel(string Username, string Password);

public record LoginResponseDto(string Token, UserInfoDto UserInfo);

public record UserInfoDto(string UserId, string Username, string Email, string Role, Guid? CustomerId);
