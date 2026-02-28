import { registerCustomElement } from "@korporus/web-component-wrapper";
import { HelloTitlebar } from "./components/HelloTitlebar";
import { HelloMain } from "./components/HelloMain";
import { HelloSettings } from "./components/HelloSettings";

registerCustomElement("hello-app-titlebar", HelloTitlebar);
registerCustomElement("hello-app-main", HelloMain);
registerCustomElement("hello-app-settings", HelloSettings);
