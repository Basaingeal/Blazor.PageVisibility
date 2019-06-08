using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;

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
