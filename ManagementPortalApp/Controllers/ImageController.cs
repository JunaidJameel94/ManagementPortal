using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;
using System.IO;
using System;

namespace ManagementPortalApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImageController : ControllerBase
    {
        private readonly string _apiUrl = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large";
        private readonly string _token = "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"; // Replace with your actual token
        private readonly IWebHostEnvironment _webHostEnvironment;

        public ImageController(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpPost("save-image")]
        public async Task<IActionResult> SaveImage([FromBody] ImageDownloadRequest request)
        {
            if (string.IsNullOrEmpty(request?.Url))
            {
                return BadRequest("Image URL cannot be null or empty.");
            }

            try
            {
                using (var httpClient = new HttpClient())
                {
                    var imageBytes = await httpClient.GetByteArrayAsync(request.Url);
                    var fileName = Path.GetFileName(new Uri(request.Url).LocalPath);
                    var filePath = Path.Combine(_webHostEnvironment.WebRootPath, "localimageNewsAI", fileName);

                    Directory.CreateDirectory(Path.GetDirectoryName(filePath));

                    await System.IO.File.WriteAllBytesAsync(filePath, imageBytes);

                    return Ok(new { FilePath = $"/localimageNewsAI/{fileName}" });
                }
            }
            catch (Exception ex)
            {
                // Log the exception details
                // _logger.LogError(ex, "Error occurred while saving the image.");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }




    }

    public class ImageDownloadRequest
    {
        public string Url { get; set; }
    }
}
