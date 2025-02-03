using ManagementPortalApp.Models.FileUpload;
using ManagementPortalApp.Models;
using ManagementPortalApp.Models.Session;
using Microsoft.AspNetCore.Authorization;
using SixLabors.ImageSharp.Processing;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Hosting;
using SixLabors.ImageSharp;

namespace ManagementPortalApp.Controllers
{
    [Authorize(AuthenticationSchemes = "ASPXAUTH")]
    public class FileUploadController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly Sessions _sessions;
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<FileUploadController> _logger;

        public FileUploadController(Sessions sessions, IWebHostEnvironment webHostEnvironment, IConfiguration configuration, ILogger<FileUploadController> logger)
        {
            _sessions = sessions;
            _environment = webHostEnvironment;
            _configuration = configuration;
            _logger = logger;
        }

        [TypeFilter(typeof(AllowedExtensionsAttribute))]
        [TypeFilter(typeof(MaxFileSizeAttribute))]
        [HttpPost]
        public IActionResult UploadNewsimage([FromForm] NewsImage doc)
        {
            try
            {
                string? fname_partial = null;
                string wwwPath = this._environment.WebRootPath;
                string contentPath = this._environment.ContentRootPath;

                ClaimsPrincipal claimsPrincipal = HttpContext.User;
                var UserID = (from c in claimsPrincipal.Claims where c.Type == "UserID" select c.Value).FirstOrDefault();
                var UniqueKey = (from c in claimsPrincipal.Claims where c.Type == "Guid" select c.Value).FirstOrDefault();

                string fname = null;

                if (_sessions.SessionExist(UniqueKey, UserID))
                {
                    SessionItems sessionItems = _sessions.GetSession(UniqueKey, UserID);

                    if (doc.file != null)
                    {
                        if (Request.Headers["User-Agent"].ToString().ToUpper() == "IE" || Request.Headers["User-Agent"].ToString().ToUpper() == "INTERNETEXPLORER")
                        {
                            string[] testfiles = doc.file.FileName.Split(new char[] { '\\' });
                            fname = testfiles[testfiles.Length - 1];
                        }
                        else
                        {
                            fname = doc.file.FileName;
                        }

                        DateTime localDateTime = DateTime.Now;
                        DateTime utcDateTime = localDateTime.ToUniversalTime();
                        TimeSpan timeSpan = utcDateTime - new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
                        double milliseconds = timeSpan.TotalMilliseconds;

                        string FileExtension = Path.GetExtension(doc.file.FileName);

                        fname_partial = DateTime.Now.Millisecond.ToString() + '_' + milliseconds + FileExtension;
                        //  string path = Path.Combine(this._environment.WebRootPath, "LocalnewsImage", "NewsImage", fname_partial);

                        string path = Path.Combine(this._environment.WebRootPath + "\\LocalnewsImage\\NewsImage\\", fname_partial);


                        using (FileStream stream = new FileStream(path, FileMode.Create))
                        {
                            doc.file.CopyTo(stream);
                        }
                    }
                }
                return Ok(@"/LocalnewsImage/NewsImage/" + fname_partial);
            }
            catch (Exception ex)
            {
                return BadRequest("Exception: " + ex.Message);
            }
        }

        [TypeFilter(typeof(AllowedExtensionsAttribute))]
        [TypeFilter(typeof(MaxFileSizeAttribute))]
        [HttpPost]
        public IActionResult UploadNewsimageThumnail([FromForm] NewsImage doc)
        {
            try
            {
                string? fname_partial = null;
                string wwwPath = this._environment.WebRootPath;
                string contentPath = this._environment.ContentRootPath;

                ClaimsPrincipal claimsPrincipal = HttpContext.User;
                var UserID = (from c in claimsPrincipal.Claims where c.Type == "UserID" select c.Value).FirstOrDefault();
                var UniqueKey = (from c in claimsPrincipal.Claims where c.Type == "Guid" select c.Value).FirstOrDefault();

                string fname = null;

                if (_sessions.SessionExist(UniqueKey, UserID))
                {
                    SessionItems sessionItems = _sessions.GetSession(UniqueKey, UserID);

                    if (doc.file != null)
                    {
                        if (Request.Headers["User-Agent"].ToString().ToUpper() == "IE" || Request.Headers["User-Agent"].ToString().ToUpper() == "INTERNETEXPLORER")
                        {
                            string[] testfiles = doc.file.FileName.Split(new char[] { '\\' });
                            fname = testfiles[testfiles.Length - 1];
                        }
                        else
                        {
                            fname = doc.file.FileName;
                        }

                        DateTime localDateTime = DateTime.Now;
                        DateTime utcDateTime = localDateTime.ToUniversalTime();
                        TimeSpan timeSpan = utcDateTime - new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
                        double milliseconds = timeSpan.TotalMilliseconds;

                        string FileExtension = Path.GetExtension(doc.file.FileName);

                        fname_partial = DateTime.Now.Millisecond.ToString() + '_' + milliseconds + FileExtension;
                        //  string path = Path.Combine(this._environment.WebRootPath, "LocalnewsImage", "NewsImage", fname_partial);

                        string path = Path.Combine(this._environment.WebRootPath + "\\images\\", fname_partial);


                        using (FileStream stream = new FileStream(path, FileMode.Create))
                        {
                            doc.file.CopyTo(stream);
                        }
                    }
                }
                return Ok(@"/images/" + fname_partial);
            }
            catch (Exception ex)
            {
                return BadRequest("Exception: " + ex.Message);
            }
        }

        [HttpPost]
        public IActionResult UploadNewsimageThumnailimageAspect([FromForm] NewsImage doc)
        {
            try
            {
                string fname_partial = null;
                string wwwPath = this._environment.WebRootPath;

                ClaimsPrincipal claimsPrincipal = HttpContext.User;
                var UserID = (from c in claimsPrincipal.Claims where c.Type == "UserID" select c.Value).FirstOrDefault();
                var UniqueKey = (from c in claimsPrincipal.Claims where c.Type == "Guid" select c.Value).FirstOrDefault();

                if (_sessions.SessionExist(UniqueKey, UserID))
                {
                    if (doc.file != null)
                    {
                        // Handle file name for saving
                        string fname = doc.file.FileName;

                        // Generate unique name for images folder
                        string FileExtension = Path.GetExtension(fname);
                        DateTime utcDateTime = DateTime.UtcNow;
                        double milliseconds = (utcDateTime - new DateTime(1970, 1, 1)).TotalMilliseconds;
                        fname_partial = DateTime.Now.Millisecond.ToString() + '_' + milliseconds + FileExtension;

                        // Save original image in "images" folder
                        string defaultPath = Path.Combine(this._environment.WebRootPath + "\\images\\", fname_partial);
                        using (var image = SixLabors.ImageSharp.Image.Load(doc.file.OpenReadStream()))
                        {
                            image.Save(defaultPath);
                        }

                        // Save resized images in respective folders with original name
                        ResizeAndSaveImage(doc.file, "mobile", new Size(750, 1334), fname); // Mobile
                        ResizeAndSaveImage(doc.file, "desktop", new Size(1920, 1080), fname); // Desktop
                        ResizeAndSaveImage(doc.file, "socialmedia", new Size(1080, 1080), fname); // Social Media

                        return Ok(new
                        {
                            defaultImagePath = @"/images/" + fname_partial,
                            mobileImagePath = @"/mobile/" + fname,
                            desktopImagePath = @"/desktop/" + fname,
                            socialMediaImagePath = @"/socialmedia/" + fname
                        });
                    }
                }
                return BadRequest("No file uploaded.");
            }
            catch (Exception ex)
            {
                return BadRequest("Exception: " + ex.Message);
            }
        }


        private void ResizeAndSaveImage(IFormFile file, string folderName, Size newSize, string originalFileName)
        {
            try
            {
                // Define the folder path
                string folderPath = Path.Combine(this._environment.WebRootPath, folderName);
                string filePath = Path.Combine(folderPath, originalFileName); // Use original file name

                // Ensure directory exists
                Directory.CreateDirectory(folderPath);

                // Resize and save the image
                using (var image = Image.Load(file.OpenReadStream()))
                {
                    image.Mutate(x => x.Resize(new ResizeOptions
                    {
                        Size = newSize,
                        Mode = ResizeMode.Stretch, // Maintain aspect ratio without cropping
                        PadColor = Color.Transparent
                    }));

                    // Save resized image in its original extension
                    string fileExtension = Path.GetExtension(originalFileName).ToLower();
                    switch (fileExtension)
                    {
                        case ".png":
                            image.SaveAsPng(filePath);
                            break;
                        case ".jpg":
                        case ".jpeg":
                            image.SaveAsJpeg(filePath);
                            break;
                        case ".bmp":
                            image.SaveAsBmp(filePath);
                            break;
                        case ".gif":
                            image.SaveAsGif(filePath);
                            break;
                        default:
                            throw new Exception("Unsupported file format.");
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error resizing and saving image for {folderName}: {ex.Message}");
            }
        }


        [HttpPost]
        public IActionResult UploadNewsimageThumnailimageAspectMultipleSelect([FromForm] NewsImageMultiple doc)
        {
            try
            {
                string fname_partial = null;
                string wwwPath = this._environment.WebRootPath;

                ClaimsPrincipal claimsPrincipal = HttpContext.User;
                var UserID = (from c in claimsPrincipal.Claims where c.Type == "UserID" select c.Value).FirstOrDefault();
                var UniqueKey = (from c in claimsPrincipal.Claims where c.Type == "Guid" select c.Value).FirstOrDefault();

                if (_sessions.SessionExist(UniqueKey, UserID))
                {
                    if (doc.file != null && doc.file.Count > 0)
                    {
                        List<string> imagePaths = new List<string>();

                        foreach (var file in doc.file)
                        {
                            // Handle file name for saving
                            string fname = file.FileName;

                            // Generate unique name for images folder
                            string FileExtension = Path.GetExtension(fname);
                            DateTime utcDateTime = DateTime.UtcNow;
                            double milliseconds = (utcDateTime - new DateTime(1970, 1, 1)).TotalMilliseconds;
                            fname_partial = DateTime.Now.Millisecond.ToString() + '_' + milliseconds + FileExtension;

                            // Save original image in "images" folder
                            string defaultPath = Path.Combine(this._environment.WebRootPath + "\\images\\", fname_partial);
                            using (var image = SixLabors.ImageSharp.Image.Load(file.OpenReadStream()))
                            {
                                image.Save(defaultPath);
                            }

                            // Save resized images in respective folders with original name
                            ResizeAndSaveImageMultiple(file, "mobile", new Size(750, 1334), fname); // Mobile
                            ResizeAndSaveImageMultiple(file, "desktop", new Size(1920, 1080), fname); // Desktop
                            ResizeAndSaveImageMultiple(file, "socialmedia", new Size(1080, 1080), fname); // Social Media

                            imagePaths.Add(@"/images/" + fname_partial);
                        }

                        return Ok(new
                        {
                            imagePaths = imagePaths
                        });
                    }
                }
                return BadRequest("No file uploaded.");
            }
            catch (Exception ex)
            {
                return BadRequest("Exception: " + ex.Message);
            }
        }

        private string ResizeAndSaveImageMultiple(IFormFile file, string folderName, Size newSize, string uniqueFileName)
        {
            try
            {
                // Define the folder path
                string folderPath = Path.Combine(_environment.WebRootPath, folderName);
                Directory.CreateDirectory(folderPath);

                // Full file path for saving the resized image
                string filePath = Path.Combine(folderPath, uniqueFileName);

                // Resize and save the image
                using (var image = SixLabors.ImageSharp.Image.Load(file.OpenReadStream()))
                {
                    image.Mutate(x => x.Resize(new ResizeOptions
                    {
                        Size = newSize,
                        Mode = ResizeMode.Stretch // Maintain aspect ratio without cropping
                    }));

                    // Save resized image in its original extension
                    string fileExtension = Path.GetExtension(uniqueFileName).ToLower();
                    switch (fileExtension)
                    {
                        case ".png":
                            image.SaveAsPng(filePath);
                            break;
                        case ".jpg":
                        case ".jpeg":
                            image.SaveAsJpeg(filePath);
                            break;
                        case ".bmp":
                            image.SaveAsBmp(filePath);
                            break;
                        case ".gif":
                            image.SaveAsGif(filePath);
                            break;
                        default:
                            throw new Exception("Unsupported file format.");
                    }
                }

                return $"/{folderName}/{uniqueFileName}"; // Return the relative path for the resized image
            }
            catch (Exception ex)
            {
                throw new Exception($"Error resizing and saving image for {folderName}: {ex.Message}");
            }
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
            var filePath = Path.Combine(_environment.WebRootPath, "assets", "css", fileName);

            System.IO.File.WriteAllText(filePath, cssContent.ToString());

            // Return the relative path to the generated CSS file
            return $"/assets/css/{fileName}";
        }

        public IActionResult Index()
        {
            return View();
        }
    }
   
    public class NewsImage
    {
        public IFormFile? file { get; set; }
    }

    public class NewsImageMultiple
    {
        public List<IFormFile>? file { get; set; }
    }

}
