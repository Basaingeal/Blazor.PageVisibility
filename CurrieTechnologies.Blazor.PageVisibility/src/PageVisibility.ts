declare var DotNet: any;

const domWindow = window as any;

let assemblyName: string = "CurrieTechnologies.Blazor.PageVisibility";
let namespace: string = "CurrieTechnologies.Blazor.PageVisibility";

const visibilityCallbacks = new Map<string, () => Promise<void>>();


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

domWindow.CurrieTechnologies = domWindow.CurrieTechnologies || {};
domWindow.CurrieTechnologies.Blazor = domWindow.CurrieTechnologies.Blazor || {};
domWindow.CurrieTechnologies.Blazor.PageVisibility =
  domWindow.CurrieTechnologies.Blazor.PageVisibility || {};

domWindow.CurrieTechnologies.Blazor.PageVisibility.IsHidden = (): boolean => {
  return document.hidden;
};

domWindow.CurrieTechnologies.Blazor.PageVisibility.GetVisibilityState = (): string => {
  return document.visibilityState;
};

domWindow.CurrieTechnologies.Blazor.PageVisibility.OnVisibilityChange = (
  actionId: string,
): void => {
  const callback = visibilityCallbackFactory(actionId);
  visibilityCallbacks.set(actionId, callback);
  document.addEventListener("visibilitychange", callback);
};

domWindow.CurrieTechnologies.Blazor.PageVisibility.RemoveVisibilityChangeCallback = (
  actionId: string,
): void => {
  const callback = visibilityCallbacks.get(actionId) as () => Promise<void>;
  document.removeEventListener("visibilitychange", callback);
  visibilityCallbacks.delete(actionId);
};
