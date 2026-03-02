import { registerCustomElement } from "@korporus/web-component-wrapper";
import { DocsMenubar } from "./components/DocsMenubar";
import { DocsMain } from "./components/DocsMain";

registerCustomElement("docs-app-menubar", DocsMenubar);
registerCustomElement("docs-app-main", DocsMain);
