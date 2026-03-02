import { registerCustomElement } from "@korporus/web-component-wrapper";
import { DocsTitlebar } from "./components/DocsTitlebar";
import { DocsMain } from "./components/DocsMain";
import { DocsSettings } from "./components/DocsSettings";

registerCustomElement("docs-app-titlebar", DocsTitlebar);
registerCustomElement("docs-app-main", DocsMain);
registerCustomElement("docs-app-settings", DocsSettings);
