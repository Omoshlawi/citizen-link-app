import { useThemeStore } from "@/store/theme";
import { useMemo } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";

export function useColorScheme() {
  const { theme: userTheme } = useThemeStore();
  return userTheme;
}

export const useComputedColorScheme = () => {
  const userTheme = useColorScheme();
  const systemSchme = useSystemColorScheme();

  const theme = useMemo(() => {
    if (userTheme === "system") return systemSchme ?? "light";
    return userTheme;
  }, [userTheme, systemSchme]);

  return theme;
};
