﻿namespace ManagementPortalApp.Models.Authentication
{
    public class SMTPSettings
    {
        public string? Smtp { get; set; }
        public string? SenderEmailID { get; set; }
        public string? SmtpPassword { get; set; }
        public string? SmtpPort { get; set; }
        public string? DisplayName { get; set; }
        public bool? EnableSSL { get; set; }
    }
}
