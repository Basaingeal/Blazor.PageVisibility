"use strict";
var domWindow = window;
var assemblyName = "CurrieTechnologies.Blazor.PageVisibility";
var namespace = "CurrieTechnologies.Blazor.PageVisibility";
var visibilityCallbacks = new Map();
function dispatchVisibiliyChange(id, hidden, visibilityState) {
    return DotNet.invokeMethodAsync(namespace, "ReceiveVisibiliyChange", id, hidden, visibilityState);
}
function visibilityCallbackFactory(actionId) {
    return function () {
        return dispatchVisibiliyChange(actionId, document.hidden, document.visibilityState);
    };
}
domWindow.CurrieTechnologies = domWindow.CurrieTechnologies || {};
domWindow.CurrieTechnologies.Blazor = domWindow.CurrieTechnologies.Blazor || {};
domWindow.CurrieTechnologies.Blazor.PageVisibility =
    domWindow.CurrieTechnologies.Blazor.PageVisibility || {};
domWindow.CurrieTechnologies.Blazor.PageVisibility.IsHidden = function () {
    return document.hidden;
};
domWindow.CurrieTechnologies.Blazor.PageVisibility.GetVisibilityState = function () {
    return document.visibilityState;
};
domWindow.CurrieTechnologies.Blazor.PageVisibility.OnVisibilityChange = function (actionId) {
    var callback = visibilityCallbackFactory(actionId);
    visibilityCallbacks.set(actionId, callback);
    document.addEventListener("visibilitychange", callback);
};
domWindow.CurrieTechnologies.Blazor.PageVisibility.RemoveVisibilityChangeCallback = function (actionId) {
    var callback = visibilityCallbacks.get(actionId);
    document.removeEventListener("visibilitychange", callback);
    visibilityCallbacks.delete(actionId);
};
