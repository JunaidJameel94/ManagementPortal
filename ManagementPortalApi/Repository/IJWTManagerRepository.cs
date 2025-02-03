using ManagementPortalApi.Models.Authentication;
using System.Security.Claims;

namespace ManagementPortalApi.Repository
{
    public interface IJWTManagerRepository
    {
        Tokens Authenticate(UserDTO users);
        Tokens ApiUserAuthenticate(ApiUserDTO users);
        ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
    }
}
