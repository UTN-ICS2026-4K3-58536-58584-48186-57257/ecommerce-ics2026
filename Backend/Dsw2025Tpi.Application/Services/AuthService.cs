using Dsw2025Tpi.Application.Constants;
using Dsw2025Tpi.Application.Dtos;
using Dsw2025Tpi.Application.Exceptions;
using Dsw2025Tpi.Application.Services.Interfaces;
using Dsw2025Tpi.Data;
using Dsw2025Tpi.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Dsw2025Tpi.Application.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly JwtTokenService _jwtTokenService;
    private readonly Dsw2025TpiContext _context;

    public AuthService(
        UserManager<IdentityUser> userManager,
        SignInManager<IdentityUser> signInManager,
        JwtTokenService jwtTokenService,
        Dsw2025TpiContext context)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _jwtTokenService = jwtTokenService;
        _context = context;
    }

    public async Task<LoginResponseDto> LoginAsync(string username, string password)
    {
        var user = await _userManager.FindByNameAsync(username);
        if (user == null)
            throw new AuthenticationException(ErrorMessages.InvalidCredentials);

        var result = await _signInManager.CheckPasswordSignInAsync(user, password, false);
        if (!result.Succeeded)
            throw new AuthenticationException(ErrorMessages.InvalidCredentials);

        var roles = await _userManager.GetRolesAsync(user);
        var role = roles.FirstOrDefault() ?? "customer";

        var customer = await _context.Customers
            .FirstOrDefaultAsync(c => c.IdentityUserId == user.Id);

        var token = _jwtTokenService.GenerateToken(user.UserName!, role);

        return new LoginResponseDto(
            token,
            new UserInfoDto(
                user.Id,
                user.UserName!,
                user.Email!,
                role,
                customer?.Id
            )
        );
    }

    public async Task<RegisterModel.RegisterResponse> RegisterAsync(RegisterModel.RegisterRequest request)
    {
        if (await _userManager.FindByNameAsync(request.Username) != null)
            throw new AuthenticationException("El usuario ya existe");

        if (await _userManager.FindByEmailAsync(request.Email) != null)
            throw new AuthenticationException("El email ya está registrado");

        var user = new IdentityUser
        {
            UserName = request.Username,
            Email = request.Email,
            EmailConfirmed = true
        };

        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            var errors = string.Join(" | ", result.Errors.Select(e => e.Description));
            throw new AuthenticationException($"Error al registrar usuario: {errors}");
        }

        await _userManager.AddToRoleAsync(user, request.Role);

        Guid? customerId = null;

        if (request.Role == "customer")
        {
            var customer = new Customer
            {
                Id = Guid.NewGuid(),
                Name = request.Username,
                EMail = request.Email,
                PhoneNumber = "",
                IdentityUserId = user.Id
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            customerId = customer.Id;
        }

        return new RegisterModel.RegisterResponse(
            user.Id,
            request.Username,
            request.Email,
            request.Role,
            customerId
        );
    }
}
