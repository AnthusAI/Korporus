import { registerCustomElement } from "@korporus/web-component-wrapper";
import { HelloMenubar } from "./components/HelloMenubar";
import { HelloMain } from "./components/HelloMain";
import { HelloSettings } from "./components/HelloSettings";

registerCustomElement("hello-app-menubar", HelloMenubar);
registerCustomElement("hello-app-main", HelloMain);
registerCustomElement("hello-app-settings", HelloSettings);
