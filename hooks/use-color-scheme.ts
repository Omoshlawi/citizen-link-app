import { useThemeStore } from "@/store/theme";

export function useColorScheme() {
  const { theme } = useThemeStore();
  return theme;
}
