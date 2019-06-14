using Microsoft.Extensions.DependencyInjection;

namespace CurrieTechnologies.Blazor.PageVisibility
{
    public static class ExtensionMethods
    {
        public static IServiceCollection AddPageVisibility(this IServiceCollection services)
        {
            return services.AddSingleton<PageVisibilityService>();
        }
    }
}
