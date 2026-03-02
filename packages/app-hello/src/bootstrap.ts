import { registerCustomElement } from "@korporus/web-component-wrapper";
import { HelloMenubar } from "./components/HelloMenubar";
import { HelloMain } from "./components/HelloMain";

registerCustomElement("hello-app-menubar", HelloMenubar);
registerCustomElement("hello-app-main", HelloMain);
