"use strict";
var domWindow = window;
var assemblyName = "CurrieTechnologies.Blazor.PageVisibility";
var namespace = "CurrieTechnologies.Blazor.PageVisibility";
var visibilityCallbacks = new Map();
function dispatchHiddenResponse(id, hidden) {
    return DotNet.invokeMethodAsync(namespace, "ReceiveHiddenResponse", id, hidden);
}
function dispatchVisibilityStateResponse(id, visibilityState) {
    return DotNet.invokeMethodAsync(namespace, "ReceiveVisibilityStateResponse", id, visibilityState);
}
function dispatchVisibiliyChange(id, hidden, visibilityState) {
    return DotNet.invokeMethodAsync(namespace, "ReceiveVisibiliyChange", id, hidden, visibilityState);
}
function visibilityCallbackFactory(actionId) {
    return function () {
        return dispatchVisibiliyChange(actionId, document.hidden, document.visibilityState);
    };
}
function dispatchRemoveVisibilityChangeCallbackResponse(actionId) {
    return DotNet.invokeMethodAsync(namespace, "ReceiveRemoveVisibilityChangeCallbackResponse", actionId);
}
domWindow.CurrieTechnologies = domWindow.CurrieTechnologies || {};
domWindow.CurrieTechnologies.Blazor = domWindow.CurrieTechnologies.Blazor || {};
domWindow.CurrieTechnologies.Blazor.PageVisibility =
    domWindow.CurrieTechnologies.Blazor.PageVisibility || {};
domWindow.CurrieTechnologies.Blazor.PageVisibility.IsHidden = function (requestId) {
    if (document.hidden !== undefined) {
        dispatchHiddenResponse(requestId, document.hidden);
    }
    else {
        return "No visibility support";
    }
    return "";
};
domWindow.CurrieTechnologies.Blazor.PageVisibility.GetVisibilityState = function (requestId) {
    if (document.visibilityState !== undefined) {
        dispatchVisibilityStateResponse(requestId, document.visibilityState);
    }
    else {
        return "No visibility support";
    }
    return "";
};
domWindow.CurrieTechnologies.Blazor.PageVisibility.OnVisibilityChange = function (actionId) {
    if (document.visibilityState !== undefined) {
        var callback = visibilityCallbackFactory(actionId);
        visibilityCallbacks.set(actionId, callback);
        document.addEventListener("visibilitychange", callback);
    }
    else {
        return "No visibility support";
    }
    return "";
};
domWindow.CurrieTechnologies.Blazor.PageVisibility.RemoveVisibilityChangeCallback = function (actionId) {
    if (document.visibilityState !== undefined) {
        var callback = visibilityCallbacks.get(actionId);
        document.removeEventListener("visibilitychange", callback);
        visibilityCallbacks.delete(actionId);
        dispatchRemoveVisibilityChangeCallbackResponse(actionId);
    }
    else {
        return "No visibility support";
    }
    return "";
};
//# sourceMappingURL=PageVisibility.js.map