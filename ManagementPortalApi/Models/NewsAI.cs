using System.Text;
using Newtonsoft.Json;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.DataProtection.KeyManagement;

namespace ManagementPortalApi.Models
{
    public class NewsAI
    {
        private readonly string _apiUrl = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large";
        private readonly string _token = "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"; // Your Hugging Face token
        private static readonly HttpClient client = new HttpClient();  // Use a single HttpClient instance
        private readonly string apiKey = "aAkdwiGFowV3QFP8vnaQRjuORrqckqRf";
        public NewsAI()
        {
            client.DefaultRequestHeaders.Add("User-Agent", "NewsWebApp/1.0");
        }

        // Modified method to take news content instead of keyword
        public async Task<AIContent> GetCorrectedContentAsync(string newsContent)
        {
            var _data = new Data
            {
                model = "palmyra-fin-32k",
                prompt = newsContent, // Take the full news content input
                max_tokens = 150,
                temperature = 0.7,
                top_p = 0.9,
                stop = new string[] { "." },
                best_of = 1,
                random_seed = 42,
                stream = false
            };

            // Use HttpClient instead of RestClient
            var jsonData = JsonConvert.SerializeObject(_data);
            var requestMessage = new HttpRequestMessage(HttpMethod.Post, "https://api.writer.com/v1/completions")
            {
                Content = new StringContent(jsonData, Encoding.UTF8, "application/json")
            };

            requestMessage.Headers.Add("Authorization", $"Bearer {apiKey}");

            try
            {
                var response = await client.SendAsync(requestMessage);

                if (response.IsSuccessStatusCode)
                {
                    // Deserialize response content
                    var jsonResponse = JsonConvert.DeserializeObject<AIContent>(await response.Content.ReadAsStringAsync());
                    return jsonResponse;
                }
                else
                {
                    throw new Exception("API request failed with status code: " + response.StatusCode);
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error occurred: {ex.Message}", ex);
            }
        }

        public async Task<(bool Success, string Message, string ImageBase64)> GetTextToImageGenerator(Dictionary<string, string> requestData)
        {
            if (!requestData.ContainsKey("prompt") || string.IsNullOrEmpty(requestData["prompt"]))
            {
                return (false, "Prompt cannot be empty.", null);
            }

            string prompt = requestData["prompt"];

            // Prepare headers and body for the API request
            var headers = new Dictionary<string, string>
            {
                { "Authorization", $"Bearer {_token}" }
            };
            var body = new Dictionary<string, string>
            {
                { "inputs", prompt }
            };

            // Increase timeout to 5 minutes (300 seconds)
            using var httpClient = new HttpClient
            {
                Timeout = TimeSpan.FromMinutes(5) // Increase timeout duration
            };

            var requestMessage = new HttpRequestMessage(HttpMethod.Post, _apiUrl)
            {
                Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(body), Encoding.UTF8, "application/json")
            };

            foreach (var header in headers)
            {
                requestMessage.Headers.Add(header.Key, header.Value);
            }

            try
            {
                var response = await httpClient.SendAsync(requestMessage);

                if (response.IsSuccessStatusCode)
                {
                    var contentType = response.Content.Headers.ContentType.MediaType;

                    if (contentType == "application/json")
                    {
                        // Handle JSON response
                        var jsonResponse = await response.Content.ReadAsStringAsync();
                        return (true, jsonResponse, null);
                    }
                    else if (contentType.StartsWith("image/"))
                    {
                        // Handle binary image response
                        var imageBytes = await response.Content.ReadAsByteArrayAsync();
                        var base64Image = Convert.ToBase64String(imageBytes);
                        return (true, "Image generated successfully.", base64Image);
                    }
                    else
                    {
                        return (false, "Unexpected content type in response.", null);
                    }
                }
                else
                {
                    return (false, $"API request failed with status code: {response.StatusCode}", null);
                }
            }
            catch (TaskCanceledException)
            {
                return (false, "The request timed out. Please try again later.", null);
            }
            catch (Exception ex)
            {
                return (false, $"Exception occurred: {ex.Message}", null);
            }
        }
    }

    // Helper class for data payload
    public class Data
    {
        public string model { get; set; }
        public string prompt { get; set; }
        public int max_tokens { get; set; }
        public double temperature { get; set; }
        public double top_p { get; set; }
        public string[] stop { get; set; }
        public int best_of { get; set; }
        public int random_seed { get; set; }
        public bool stream { get; set; }
    }

    public class AIContent
    {
        public List<Choices> choices { get; set; }
        public string model { get; set; }
    }

    public class Choices
    {
        public string text { get; set; }
        public string log_probs { get; set; }
    }
}
