declare var DotNet: any;

const domWindow = window as any;

let assemblyName: string = "CurrieTechnologies.Blazor.PageVisibility";
let namespace: string = "CurrieTechnologies.Blazor.PageVisibility";

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
