// ===== Middleware/ExceptionHandlingMiddleware.cs =====
using System.Net;
using System.Text.Json;

namespace HazwalInventoryAPI.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred");
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            var response = new { message = exception.Message, statusCode = 500 };

            if (exception is ArgumentException)
            {
                context.Response.StatusCode = StatusCodes.Status400BadRequest;
                response = new { message = exception.Message, statusCode = 400 };
            }
            else if (exception is KeyNotFoundException)
            {
                context.Response.StatusCode = StatusCodes.Status404NotFound;
                response = new { message = "Resource not found", statusCode = 404 };
            }
            else
            {
                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            }

            return context.Response.WriteAsJsonAsync(response);
        }
    }
}