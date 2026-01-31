import { useThemeStore } from "@/store/theme";

export function useColorScheme() {
  const { theme: userTheme } = useThemeStore();

  return userTheme;
}
