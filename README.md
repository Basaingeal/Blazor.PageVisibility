# CurrieTechnologies.Blazor.PageVisibility
This package provides Blazor applications with access to the browser's [Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)

## This package is for Client-side Blazor only. For Server-side Blazor use [CurrieTechnologies.Razor.PageVisibility](https://github.com/Basaingeal/Razor.PageVisibility)

## Usage
1) In your Blazor app, add the `CurrieTechnologies.Blazor.PageVisibility` [NuGet package](https://www.nuget.org/packages/CurrieTechnologies.Blazor.PageVisibility/)

    ```
    Install-Package CurrieTechnologies.Blazor.PageVisibility
    ```

1) In your Blazor app's `Startup.cs`, register the 'PageVisibilityService'.

    ```
    public void ConfigureServices(IServiceCollection services)
    {
        ...
        services.AddPageVisibility();
        ...
    }
    ```

1) Now you can inject the PageVisibilityService into any Blazor page and use it like this:

    ```
    @inject PageVisibilityService visibility

    <div>
      <ul>
        @foreach (var vs in viewStates)
        {
          <li>@vs</li>
        }
      </ul>
      @if (listenerId != Guid.Empty)
      {
        <button @onclick="@HandleUnsubscibe">Unsubscribe</button>
      }
      else
      {
        <button @onclick="@(async () => listenerId = await visibility.OnVisibilityChangeAsync(OnVisibilityChange, this))">
          Resubscribe
        </button>
      }

    </div>

    @code {
      private List<string> viewStates = new List<string>();
      private Guid listenerId = Guid.Empty;

      protected override async Task OnInitAsync()
      {
        viewStates.Add(await visibility.GetVisibilityStateAsync());

        listenerId = await visibility.OnVisibilityChangeAsync(OnVisibilityChange, this);

        await base.OnInitAsync();
      }

      Task OnVisibilityChange(VisibilityInfo visibilityInfo)
      {
        viewStates.Add(visibilityInfo.VisibilityState);
        return Task.CompletedTask;
      }

      async Task HandleUnsubscibe()
      {
        await visibility.RemoveVisibilityChangeCallbackAsync(listenerId);
        listenerId = Guid.Empty;
      }
    }
    ```
