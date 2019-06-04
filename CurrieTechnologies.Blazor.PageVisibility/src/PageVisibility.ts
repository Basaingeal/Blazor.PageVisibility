declare var DotNet: any;

const domWindow = window as any;

let assemblyName: string = "CurrieTechnologies.Blazor.PageVisibility";
let namespace: string = "CurrieTechnologies.Blazor.PageVisibility";

const visibilityCallbacks = new Map<string, () => Promise<void>>();

function dispatchHiddenResponse(id: string, hidden: boolean): Promise<void> {
  return DotNet.invokeMethodAsync(
    namespace,
    "ReceiveHiddenResponse",
    id,
    hidden,
  );
}

function dispatchVisibilityStateResponse(
  id: string,
  visibilityState: string,
): Promise<void> {
  return DotNet.invokeMethodAsync(
    namespace,
    "ReceiveVisibilityStateResponse",
    id,
    visibilityState,
  );
}

function dispatchVisibiliyChange(
  id: string,
  hidden: boolean,
  visibilityState: string,
): Promise<void> {
  return DotNet.invokeMethodAsync(
    namespace,
    "ReceiveVisibiliyChange",
    id,
    hidden,
    visibilityState,
  );
}

function visibilityCallbackFactory(actionId: string) {
  return () =>
    dispatchVisibiliyChange(
      actionId,
      document.hidden,
      document.visibilityState,
    );
}

function dispatchRemoveVisibilityChangeCallbackResponse(
  actionId: string,
): Promise<void> {
  return DotNet.invokeMethodAsync(
    namespace,
    "ReceiveRemoveVisibilityChangeCallbackResponse",
    actionId,
  );
}

domWindow.CurrieTechnologies = domWindow.CurrieTechnologies || {};
domWindow.CurrieTechnologies.Blazor = domWindow.CurrieTechnologies.Blazor || {};
domWindow.CurrieTechnologies.Blazor.PageVisibility =
  domWindow.CurrieTechnologies.Blazor.PageVisibility || {};

domWindow.CurrieTechnologies.Blazor.PageVisibility.IsHidden = (
  requestId: string,
): string => {
  if (document.hidden !== undefined) {
    dispatchHiddenResponse(requestId, document.hidden);
  } else {
    return "No visibility support";
  }

  return "";
};

domWindow.CurrieTechnologies.Blazor.PageVisibility.GetVisibilityState = (
  requestId: string,
): string => {
  if (document.visibilityState !== undefined) {
    dispatchVisibilityStateResponse(requestId, document.visibilityState);
  } else {
    return "No visibility support";
  }

  return "";
};

domWindow.CurrieTechnologies.Blazor.PageVisibility.OnVisibilityChange = (
  actionId: string,
) => {
  if (document.visibilityState !== undefined) {
    const callback = visibilityCallbackFactory(actionId);
    visibilityCallbacks.set(actionId, callback);
    document.addEventListener("visibilitychange", callback);
  } else {
    return "No visibility support";
  }

  return "";
};

domWindow.CurrieTechnologies.Blazor.PageVisibility.RemoveVisibilityChangeCallback = (
  actionId: string,
) => {
  if (document.visibilityState !== undefined) {
    const callback = visibilityCallbacks.get(actionId) as () => Promise<void>;
    document.removeEventListener("visibilitychange", callback);
    visibilityCallbacks.delete(actionId);
    dispatchRemoveVisibilityChangeCallbackResponse(actionId);
  } else {
    return "No visibility support";
  }

  return "";
};
