import { useLanguageStore } from "@/store/language";

/**
 * Hook to access and manage language preference
 * Language is persisted to device storage
 */
export function useLanguage() {
  const { language, setLanguage } = useLanguageStore();
  return { language, setLanguage };
}
