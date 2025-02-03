using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace ManagementPortalApp.Controllers
{
    public class StyleGeneratedController : Controller
    {
        private readonly IWebHostEnvironment _env;

        // Inject IWebHostEnvironment into the controller
        public StyleGeneratedController(IWebHostEnvironment env)
        {
            _env = env;
        }

        [HttpPost]
        public IActionResult GenerateCssFile([FromBody] CssGenerationRequest requestData)
        {
            try
            {
                if (string.IsNullOrEmpty(requestData.TemplateName))
                {
                    return BadRequest("Template name is required.");
                }

                if (requestData.Styles == null || !requestData.Styles.Any())
                {
                    return BadRequest("Styles data is required.");
                }

                string cssFilePath = GenerateCssFile(requestData.TemplateName, requestData.Styles);

                // Return the relative path to the generated CSS file
                return Ok(new { filePath = cssFilePath });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        private string GenerateCssFile(string templateName, Dictionary<string, Dictionary<string, string>> styles)
        {
            var cssContent = new System.Text.StringBuilder();
            foreach (var style in styles)
            {
                var selector = style.Key;
                var properties = style.Value;
                cssContent.AppendLine($"{selector} {{");
                foreach (var property in properties)
                {
                    cssContent.AppendLine($"    {property.Key}: {property.Value};");
                }
                cssContent.AppendLine("}");
            }

            var fileName = $"{templateName}_{DateTime.Now.Ticks}.css";
            var filePath = Path.Combine(_env.WebRootPath, "assets", "css", fileName);

            System.IO.File.WriteAllText(filePath, cssContent.ToString());

            // Return the relative path to the generated CSS file
            return $"/assets/css/{fileName}";
        }
    }

    public class CssGenerationRequest
    {
        public string TemplateName { get; set; }
        public Dictionary<string, Dictionary<string, string>> Styles { get; set; }
    }
}
