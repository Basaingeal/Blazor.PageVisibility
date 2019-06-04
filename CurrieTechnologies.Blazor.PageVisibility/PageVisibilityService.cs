using Microsoft.JSInterop;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CurrieTechnologies.Blazor.PageVisibility
{
    public class PageVisibilityService
    {
        private readonly IJSRuntime jSRuntime;
        static readonly IDictionary<Guid, TaskCompletionSource<bool>> pendingHiddenRequests =
           new Dictionary<Guid, TaskCompletionSource<bool>>();
        static readonly IDictionary<Guid, TaskCompletionSource<string>> pendingVisibilityStateRequests =
           new Dictionary<Guid, TaskCompletionSource<string>>();

        public PageVisibilityService(IJSRuntime jSRuntime)
        {
            this.jSRuntime = jSRuntime;
        }

        public async Task<bool> IsHiddenAsync()
        {
            var tcs = new TaskCompletionSource<bool>();
            var requestId = Guid.NewGuid();
            pendingHiddenRequests.Add(requestId, tcs);
            await jSRuntime.InvokeAsync<string>("CurrieTechnologies.Blazor.PageVisibility.IsHidden", requestId);

            return await tcs.Task;
        }

        [JSInvokable]
        public static void ReceiveHiddenResponse(string requestId, bool hidden)
        {
            var requestGuid = Guid.Parse(requestId);
            var pendingTask = pendingHiddenRequests.First(x => x.Key == requestGuid).Value;
            pendingTask.SetResult(hidden);
        }

        public async Task<string> GetVisibilityState()
        {
            var tcs = new TaskCompletionSource<string>();
            var requestId = Guid.NewGuid();
            pendingVisibilityStateRequests.Add(requestId, tcs);
            await jSRuntime.InvokeAsync<string>("CurrieTechnologies.Blazor.PageVisibility.GetVisibilityState", requestId);

            return await tcs.Task;
        }

        [JSInvokable]
        public static void ReceiveVisibilityStateResponse(string requestId, string visibiltyState)
        {
            var requestGuid = Guid.Parse(requestId);
            var pendingTask = pendingVisibilityStateRequests.First(x => x.Key == requestGuid).Value;
            pendingTask.SetResult(visibiltyState);
        }

    }
}
