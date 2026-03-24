using LaundryManagement.API.data;
using LaundryManagement.API.models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LaundryManagement.API.DTOs;
using System.Text.Json;

namespace LaundryManagement.API.Controllers
{
    [ApiController]
    [Route("api/payments")]
    public class PaymentsController : ControllerBase
    {
        private readonly LaundryDbContext _context;
        private readonly MpesaService _mpesaService;

        public PaymentsController(LaundryDbContext context, MpesaService mpesaService)
        {
            _context = context;
            _mpesaService = mpesaService;
        }

        // POST api/payments/cash
        [HttpPost("cash")]
        public async Task<IActionResult> CashOnDelivery([FromBody] CashPaymentDto dto)
        {
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.OrderId == dto.OrderId);
            if (order == null) return NotFound("Order not found.");

            if (order.PaymentStatus != "Unpaid")
                return BadRequest("Order has already been paid or payment is in progress.");

            var payment = new Payment
            {
                OrderId = dto.OrderId,
                Method = "Cash",
                Status = "Pending",
                Amount = order.TotalPrice ?? 0,
            };

            order.PaymentStatus = "PendingDelivery";

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                payment.PaymentId,
                payment.Method,
                payment.Status,
                payment.Amount,
                Message = "Cash on delivery selected. Payment will be collected upon delivery."
            });
        }

        // GET api/payments/order/{orderId}
        [HttpGet("order/{orderId}")]
        public async Task<IActionResult> GetPaymentByOrder(int orderId)
        {
            var payment = await _context.Payments
                .Where(p => p.OrderId == orderId)
                .Select(p => new
                {
                    p.PaymentId,
                    p.Method,
                    p.Status,
                    p.Amount,
                    p.TransactionId,
                    p.CreatedAt,
                    p.PaidAt
                })
                .FirstOrDefaultAsync();

            if (payment == null)
                return NotFound("No payment found for this order.");

            return Ok(payment);
        }

        // POST api/payments/mpesa
        [HttpPost("mpesa")]
        public async Task<IActionResult> MpesaPayment([FromBody] MpesaPaymentDto dto)
        {
            var order = await _context.Orders
                .Include(o => o.Customer)
                .FirstOrDefaultAsync(o => o.OrderId == dto.OrderId);

            if (order == null) return NotFound("Order not found.");

            if (order.PaymentStatus != "Unpaid")
                return BadRequest("Order has already been paid or payment is in progress.");

            // Use phone from DTO or fall back to customer profile
            var phone = dto.PhoneNumber ?? order.Customer.Phone;
            if (string.IsNullOrEmpty(phone))
                return BadRequest("Phone number is required for M-Pesa payment.");

            // Initiate STK Push
            var mpesaResponse = await _mpesaService.StkPushAsync(
                phone,
                order.TotalPrice ?? 0,
                order.OrderId
            );

            // Create pending payment record
            var payment = new Payment
            {
                OrderId = dto.OrderId,
                Method = "MPesa",
                Status = "Pending",
                Amount = order.TotalPrice ?? 0,
            };

            order.PaymentStatus = "Pending";
            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                payment.PaymentId,
                payment.Method,
                payment.Status,
                payment.Amount,
                MpesaResponse = mpesaResponse,
                Message = "STK Push sent. Please check your phone and enter your M-Pesa PIN."
            });
        }

        // POST api/payments/mpesa/callback
        [HttpPost("mpesa/callback")]
        public async Task<IActionResult> MpesaCallback([FromBody] JsonElement callbackData)
        {
            try
            {
                var body = callbackData.GetProperty("Body")
                    .GetProperty("stkCallback");

                var resultCode = body.GetProperty("ResultCode").GetInt32();
                var checkoutRequestId = body.GetProperty("CheckoutRequestID").GetString();

                if (resultCode == 0)
                {
                    // Payment successful
                    var metadata = body.GetProperty("CallbackMetadata").GetProperty("Item");
                    string? mpesaReceiptNumber = null;
                    string? phoneNumber = null;

                    foreach (var item in metadata.EnumerateArray())
                    {
                        var name = item.GetProperty("Name").GetString();
                        if (name == "MpesaReceiptNumber")
                            mpesaReceiptNumber = item.GetProperty("Value").GetString();
                        if (name == "PhoneNumber")
                            phoneNumber = item.GetProperty("Value").ToString();
                    }

                    // Find and update the pending payment
                    var payment = await _context.Payments
                        .Include(p => p.Order)
                        .Where(p => p.Method == "MPesa" && p.Status == "Pending")
                        .OrderByDescending(p => p.CreatedAt)
                        .FirstOrDefaultAsync();

                    if (payment != null)
                    {
                        payment.Status = "Completed";
                        payment.TransactionId = mpesaReceiptNumber;
                        payment.PaidAt = DateTime.UtcNow;
                        payment.Order.PaymentStatus = "Paid";
                        await _context.SaveChangesAsync();
                    }
                }

                return Ok();
            }
            catch
            {
                return Ok(); // Always return 200 to M-Pesa
            }
        }



    }
}