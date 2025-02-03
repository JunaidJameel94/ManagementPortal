namespace ManagementPortalApp.Models.Base
{
    public class ApiUser
    {
        public string? UserID { get; set; }
        public string? UserName { get; set; }
        public string? UserEmail { get; set; }
        public string? UserPassword { get; set; }
        public string? AccessLevel { get; set; }
        public string? IsActive { get; set; }
    }
}
