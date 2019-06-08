using Microsoft.Extensions.DependencyInjection;

namespace CurrieTechnologies.Blazor.PageVisibility
{
    public static class ExtensionMethods
    {
        public static IServiceCollection AddPageVisibiliy(this IServiceCollection services)
        {
            return services.AddSingleton<PageVisibilityService>();
        }
    }
}
