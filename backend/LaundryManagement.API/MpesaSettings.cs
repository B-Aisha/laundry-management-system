namespace LaundryManagement.API
{
    public class MpesaSettings
    {
        public string ConsumerKey { get; set; } = null!;
        public string ConsumerSecret { get; set; } = null!;
        public string ShortCode { get; set; } = null!;
        public string Passkey { get; set; } = null!;
        public string CallbackUrl { get; set; } = null!;
        public string BaseUrl { get; set; } = null!;
    }
}