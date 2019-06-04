"use strict";
var domWindow = window;
var assemblyName = "CurrieTechnologies.Blazor.PageVisibility";
var namespace = "CurrieTechnologies.Blazor.PageVisibility";
function dispatchHiddenResponse(id, hidden) {
    return DotNet.invokeMethodAsync(namespace, "ReceiveHiddenResponse", id, hidden);
}
function dispatchVisibilityStateResponse(id, visibilityState) {
    return DotNet.invokeMethodAsync(namespace, "ReceiveVisibilityStateResponse", id, visibilityState);
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
//# sourceMappingURL=PageVisibility.js.map