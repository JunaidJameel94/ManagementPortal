using Microsoft.AspNetCore.Mvc;

namespace ManagementPortalApi.Controllers
{
    public class DownloadImageController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IWebHostEnvironment _environment;

        public DownloadImageController(IHttpClientFactory httpClientFactory, IWebHostEnvironment environment)
        {
            _httpClientFactory = httpClientFactory;
            _environment = environment;
        }

        [HttpPost("download")]
        public async Task<IActionResult> DownloadImage([FromBody] ImageDownloadRequest request)
        {
            if (string.IsNullOrEmpty(request.ImageUrl))
            {
                return BadRequest("Image URL is required.");
            }

            var client = _httpClientFactory.CreateClient();
            var response = await client.GetAsync(request.ImageUrl);

            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, "Error downloading image.");
            }

            var imageBytes = await response.Content.ReadAsByteArrayAsync();
            var imageName = Path.GetFileName(request.ImageUrl);
            var imagePath = Path.Combine(_environment.WebRootPath, "localimage", imageName);

            await System.IO.File.WriteAllBytesAsync(imagePath, imageBytes);

            return Ok(new { ImagePath = $"/localimage/{imageName}" });
        }
    }

    public class ImageDownloadRequest
    {
        public string ImageUrl { get; set; }
    }
}
