using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;

namespace LaundryManagement.API
{
    public class MpesaService
    {
        private readonly MpesaSettings _settings;
        private readonly HttpClient _httpClient;

        public MpesaService(IOptions<MpesaSettings> settings, HttpClient httpClient)
        {
            _settings = settings.Value;
            _httpClient = httpClient;
        }

        // Get OAuth token
        private async Task<string> GetAccessTokenAsync()
        {
            var credentials = Convert.ToBase64String(
                Encoding.UTF8.GetBytes($"{_settings.ConsumerKey}:{_settings.ConsumerSecret}")
            );

            var request = new HttpRequestMessage(HttpMethod.Get,
                $"{_settings.BaseUrl}/oauth/v1/generate?grant_type=client_credentials");
            request.Headers.Authorization = new AuthenticationHeaderValue("Basic", credentials);

            var response = await _httpClient.SendAsync(request);
            var content = await response.Content.ReadAsStringAsync();
            var json = JsonSerializer.Deserialize<JsonElement>(content);

            return json.GetProperty("access_token").GetString()!;
        }

        // Initiate STK Push
        public async Task<string> StkPushAsync(string phoneNumber, decimal amount, int orderId)
        {
            var token = await GetAccessTokenAsync();
            var timestamp = DateTime.Now.ToString("yyyyMMddHHmmss");
            var password = Convert.ToBase64String(
                Encoding.UTF8.GetBytes($"{_settings.ShortCode}{_settings.Passkey}{timestamp}")
            );

            // Format phone number — ensure it starts with 254
            if (phoneNumber.StartsWith("0"))
                phoneNumber = "254" + phoneNumber.Substring(1);
            if (phoneNumber.StartsWith("+"))
                phoneNumber = phoneNumber.Substring(1);

            var payload = new
            {
                BusinessShortCode = _settings.ShortCode,
                Password = password,
                Timestamp = timestamp,
                TransactionType = "CustomerPayBillOnline",
                Amount = (int)Math.Ceiling(amount),
                PartyA = phoneNumber,
                PartyB = _settings.ShortCode,
                PhoneNumber = phoneNumber,
                CallBackURL = _settings.CallbackUrl,
                AccountReference = $"Order#{orderId}",
                TransactionDesc = $"Payment for Order #{orderId}"
            };

            var request = new HttpRequestMessage(HttpMethod.Post,
                $"{_settings.BaseUrl}/mpesa/stkpush/v1/processrequest");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            request.Content = new StringContent(
                JsonSerializer.Serialize(payload),
                Encoding.UTF8,
                "application/json"
            );

            var response = await _httpClient.SendAsync(request);
            var content = await response.Content.ReadAsStringAsync();
            return content;
        }
    }
}