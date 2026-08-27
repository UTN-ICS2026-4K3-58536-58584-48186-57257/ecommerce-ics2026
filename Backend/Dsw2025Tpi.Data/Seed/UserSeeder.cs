using Dsw2025Tpi.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace Dsw2025Tpi.Data.Seed;

public class UserSeeder
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IServiceProvider _serviceProvider;

    public UserSeeder(
        UserManager<IdentityUser> userManager,
        RoleManager<IdentityRole> roleManager,
        IServiceProvider serviceProvider)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _serviceProvider = serviceProvider;
    }

    public async Task SeedAsync()
    {
        string[] roles = { "admin", "customer" };

        foreach (var role in roles)
        {
            if (!await _roleManager.RoleExistsAsync(role))
                await _roleManager.CreateAsync(new IdentityRole(role));
        }

        await CreateUserWithCustomer("admin", "Admin123*", "admin");
        await CreateUserWithCustomer("customer", "Customer123*", "customer");
    }

    private async Task CreateUserWithCustomer(string username, string password, string role)
    {
        var user = await _userManager.FindByNameAsync(username);

        if (user == null)
        {
            user = new IdentityUser
            {
                UserName = username,
                Email = $"{username}@gmail.com",
                EmailConfirmed = true
            };

            await _userManager.CreateAsync(user, password);
            await _userManager.AddToRoleAsync(user, role);

            if (role == "customer")
            {
                using var scope = _serviceProvider.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<Dsw2025TpiContext>();

                var customer = new Customer
                {
                    Id = Guid.NewGuid(),
                    Name = username,
                    EMail = $"{username}@gmail.com",
                    PhoneNumber = "",
                    IdentityUserId = user.Id
                };

                db.Customers.Add(customer);
                await db.SaveChangesAsync();
            }
        }
    }
}
