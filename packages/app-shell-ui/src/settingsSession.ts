import { useEffect, useRef } from "react";
import { useHostElement } from "@korporus/web-component-wrapper";

export interface SettingsSessionState {
  dirty: boolean;
  valid: boolean;
  saving?: boolean;
}

export const SETTINGS_STATE_EVENT = "korporus:settings:session-state";
export const SETTINGS_SAVE_EVENT = "korporus:settings:save";
export const SETTINGS_CANCEL_EVENT = "korporus:settings:cancel";

export function emitSettingsSessionState(host: HTMLElement, state: SettingsSessionState): void {
  host.dispatchEvent(
    new CustomEvent(SETTINGS_STATE_EVENT, {
      detail: { state },
      bubbles: true,
      composed: true,
    }),
  );
}

export function bindSettingsSessionEvents(
  host: HTMLElement,
  onSave: () => Promise<void> | void,
  onCancel: () => void,
): () => void {
  const handleSave = () => {
    void onSave();
  };
  const handleCancel = () => {
    onCancel();
  };

  host.addEventListener(SETTINGS_SAVE_EVENT, handleSave as EventListener);
  host.addEventListener(SETTINGS_CANCEL_EVENT, handleCancel as EventListener);

  return () => {
    host.removeEventListener(SETTINGS_SAVE_EVENT, handleSave as EventListener);
    host.removeEventListener(SETTINGS_CANCEL_EVENT, handleCancel as EventListener);
  };
}

export function useSettingsSessionBridge(options: {
  hostElement?: HTMLElement | null;
  state: SettingsSessionState;
  onSave: () => Promise<void> | void;
  onCancel: () => void;
}): void {
  const contextHost = useHostElement();
  const host = options.hostElement ?? contextHost;
  const onSaveRef = useRef(options.onSave);
  const onCancelRef = useRef(options.onCancel);

  onSaveRef.current = options.onSave;
  onCancelRef.current = options.onCancel;

  useEffect(() => {
    if (!host) return;
    return bindSettingsSessionEvents(
      host,
      () => onSaveRef.current(),
      () => onCancelRef.current(),
    );
  }, [host]);

  useEffect(() => {
    if (!host) return;
    emitSettingsSessionState(host, options.state);
  }, [host, options.state.dirty, options.state.valid, options.state.saving]);
}
