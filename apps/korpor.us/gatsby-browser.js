import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-sans/700.css";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "./src/styles/global.css";

const syncSystemTheme = () => {
  try {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  } catch {
    // ignore
  }
};

export const onInitialClientRender = () => {
  syncSystemTheme();
  try {
    localStorage.removeItem("theme");
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", syncSystemTheme);

    const observer = new MutationObserver(() => {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const root = document.documentElement;
      if (isDark) {
        root.classList.add("dark");
        root.classList.remove("light");
      } else {
        root.classList.add("light");
        root.classList.remove("dark");
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  } catch {
    // ignore
  }
};

export const onRouteUpdate = () => {
  syncSystemTheme();
};
