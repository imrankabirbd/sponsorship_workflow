using System.Net;

namespace Sponsorship.API
{
    public class ApiKeyMiddleware
    {
        private readonly RequestDelegate _next;
        private const string key = "api_key";
        private const string value = "spworkflow@pi2026";

        public ApiKeyMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Bypass API key check for Swagger

            var path = context.Request.Path.ToString().ToLower();

            if (path.Contains("/swagger") ||
                path.Contains("swagger/v1/swagger.json") ||
                path.Contains("/index.html") ||
                path.Contains("/favicon.ico") ||
                path.Contains(".css") ||
                path.Contains(".js") ||
                path.Contains(".png") ||
                path.Contains(".jpg"))
            {
                await _next(context);
                return;
            }

            // Check header
            if (!context.Request.Headers.TryGetValue(key, out var extractedKey))
            {
                context.Response.StatusCode = (int)HttpStatusCode.Forbidden;
                await context.Response.WriteAsync("Invalid API Key");
                return;
            }

            if (extractedKey != value)
            {
                context.Response.StatusCode = (int)HttpStatusCode.Forbidden;
                await context.Response.WriteAsync("Invalid API Key");
                return;
            }

            await _next(context);
        }
    }
}