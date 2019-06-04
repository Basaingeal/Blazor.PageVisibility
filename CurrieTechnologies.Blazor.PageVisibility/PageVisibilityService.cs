using Microsoft.AspNetCore.Components;
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
        static readonly IDictionary<Guid, TaskCompletionSource<object>> pendingRemoveVisibilityChangeCallbackRequests =
           new Dictionary<Guid, TaskCompletionSource<object>>();

        static readonly IDictionary<Guid, EventCallback<VisibilityInfo>> visibilityChangeCallbacks =
           new Dictionary<Guid, EventCallback<VisibilityInfo>>();

        public PageVisibilityService(IJSRuntime jSRuntime)
        {
            this.jSRuntime = jSRuntime;
        }

        /// <summary>
        /// Returns true if the page is in a state considered to be hidden to the user, and false otherwise.
        /// </summary>
        /// <returns></returns>
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

        /// <summary>
        /// A DOMString indicating the document's current visibility state.
        /// <see cref="VisibilityState"/>
        /// </summary>
        /// <returns></returns>
        public async Task<string> GetVisibilityStateAsync()
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

        /// <summary>
        /// An EventListener providing the code to be called when the visibilitychange event is fired.
        /// </summary>
        /// <param name="visibilityCallback"></param>
        /// <returns>A GUID that can be used to clear the event callback</returns>
        public async Task<Guid> OnVisibilityChangeAsync(EventCallback<VisibilityInfo> visibilityCallback)
        {
            var actionId = Guid.NewGuid();
            visibilityChangeCallbacks.Add(actionId, visibilityCallback);
            await jSRuntime.InvokeAsync<string>("CurrieTechnologies.Blazor.PageVisibility.OnVisibilityChange", actionId);
            return actionId;
        }

        [JSInvokable]
        public static async Task ReceiveVisibiliyChange(string id, bool hidden, string visibilityState)
        {
            var actionId = Guid.Parse(id);
            if (!visibilityChangeCallbacks.Keys.Contains(actionId))
            {
                return;
            }
            var action = visibilityChangeCallbacks.First(x => x.Key == actionId).Value;
            var visibilityInfo = new VisibilityInfo
            {
                Hidden = hidden,
                VisibilityState = visibilityState
            };
            await action.InvokeAsync(visibilityInfo);
        }

        /// <summary>
        /// Removes a callback set with OnVisibilityChangeAsync.
        /// </summary>
        /// <param name="callbackId">The GUID of the callback obtained when setting the listener</param>
        /// <returns></returns>
        public async Task RemoveVisibilityChangeCallbackAsync(Guid callbackId)
        {
            if (visibilityChangeCallbacks.ContainsKey(callbackId))
            {
                visibilityChangeCallbacks.Remove(callbackId);
            }

            var tcs = new TaskCompletionSource<object>();
            pendingRemoveVisibilityChangeCallbackRequests.Add(callbackId, tcs);
            await jSRuntime.InvokeAsync<string>("CurrieTechnologies.Blazor.PageVisibility.RemoveVisibilityChangeCallback", callbackId);

            await tcs.Task;
        }

        /// <summary>
        /// Removes a callback set with OnVisibilityChangeAsync.
        /// </summary>
        /// <param name="callbackId">The GUID of the callback obtained when setting the listener</param>
        /// <returns></returns>
        public Task RemoveVisibilityChangeCallbackAsync(string callbackId)
        {
            var callbackIdGuid = Guid.Parse(callbackId);
            return RemoveVisibilityChangeCallbackAsync(callbackIdGuid);
        }

        [JSInvokable]
        public static void ReceiveRemoveVisibilityChangeCallbackResponse(string actionId)
        {
            var actionIdGuid = Guid.Parse(actionId);
            var pendingTask = pendingRemoveVisibilityChangeCallbackRequests.First(x => x.Key == actionIdGuid).Value;
            pendingTask.SetResult(null);
        }
    }
}
