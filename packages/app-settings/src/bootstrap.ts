import { registerCustomElement } from "@korporus/web-component-wrapper";
import { SettingsMenubar } from "./components/SettingsMenubar";
import { SettingsMain } from "./components/SettingsMain";

registerCustomElement("settings-app-menubar", SettingsMenubar);
registerCustomElement("settings-app-main", SettingsMain);
