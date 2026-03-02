import { useEffect, useState } from "react";
import {
  readAppearance,
  subscribeAppearance,
  type AppearanceSettingsV1,
} from "@korporus/system-settings";

export function useAppearanceSettings(): AppearanceSettingsV1 {
  const [appearance, setAppearance] = useState<AppearanceSettingsV1>(() => readAppearance());

  useEffect(() => subscribeAppearance(setAppearance), []);

  return appearance;
}
