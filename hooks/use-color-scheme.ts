import { useThemeStore } from "@/store/theme";
import { useMemo } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";

export function useColorScheme() {
  const systemTheme = useSystemColorScheme(); // System theme
  const { theme: userTheme } = useThemeStore();
  console.log({ systemTheme, userTheme });

  const theme = useMemo(() => {
    if (userTheme === "system") return systemTheme;
    return userTheme;
  }, [systemTheme, userTheme]);

  console.log(theme);

  return theme;
}
