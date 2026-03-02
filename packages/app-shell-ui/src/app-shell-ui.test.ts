// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import {
  bindSettingsSessionEvents,
  emitSettingsSessionState,
  SETTINGS_CANCEL_EVENT,
  SETTINGS_SAVE_EVENT,
  SETTINGS_STATE_EVENT,
  filterSidebarItems,
} from "./index";

describe("filterSidebarItems", () => {
  it("matches by label and keywords", () => {
    const items = [
      { id: "mode", label: "Mode", keywords: ["light", "dark", "system"] },
      { id: "theme", label: "Theme", keywords: ["cool", "warm"] },
    ];

    expect(filterSidebarItems(items, "warm")).toEqual([items[1]]);
    expect(filterSidebarItems(items, "mod")).toEqual([items[0]]);
    expect(filterSidebarItems(items, "")).toEqual(items);
  });
});

describe("settings session events", () => {
  it("emits and listens to save/cancel events", () => {
    const host = document.createElement("div");
    const onSave = vi.fn();
    const onCancel = vi.fn();

    const cleanup = bindSettingsSessionEvents(host, onSave, onCancel);

    host.dispatchEvent(new CustomEvent(SETTINGS_SAVE_EVENT));
    host.dispatchEvent(new CustomEvent(SETTINGS_CANCEL_EVENT));

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(1);

    cleanup();
  });

  it("dispatches session state with expected payload", () => {
    const host = document.createElement("div");
    const listener = vi.fn();

    host.addEventListener(SETTINGS_STATE_EVENT, listener as EventListener);
    emitSettingsSessionState(host, { dirty: true, valid: false, saving: true });

    expect(listener).toHaveBeenCalledTimes(1);
    const event = listener.mock.calls[0][0] as CustomEvent<{
      state: { dirty: boolean; valid: boolean; saving?: boolean };
    }>;
    expect(event.detail.state.dirty).toBe(true);
    expect(event.detail.state.valid).toBe(false);
    expect(event.detail.state.saving).toBe(true);
  });
});
