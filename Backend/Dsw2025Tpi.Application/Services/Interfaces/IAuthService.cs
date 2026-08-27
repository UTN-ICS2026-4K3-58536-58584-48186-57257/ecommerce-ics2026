using Dsw2025Tpi.Application.Dtos;

namespace Dsw2025Tpi.Application.Services.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponseDto> LoginAsync(string username, string password);

        Task<RegisterModel.RegisterResponse> RegisterAsync(RegisterModel.RegisterRequest request);
    }
}

