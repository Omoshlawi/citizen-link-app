import { useColorScheme } from "@/hooks/use-color-scheme";
import { Pressable, StyleSheet, View } from "react-native";

interface BottomSheetBackdropProps {
  /** Callback when backdrop is pressed (optional, for security reasons usually disabled) */
  onPress?: () => void;
}

/**
 * BottomSheetBackdrop Component
 * 
 * Provides a semi-transparent backdrop overlay for bottom sheet modals.
 * - Theme-aware opacity
 * - Prevents interaction with background content
 * - Can be configured to allow/block dismissal
 * 
 * @example
 * ```tsx
 * <BottomSheetBackdrop onPress={handleDismiss} />
 * ```
 */
export default function BottomSheetBackdrop({
  onPress,
}: BottomSheetBackdropProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Pressable
      style={styles.backdrop}
      onPress={onPress}
      disabled={!onPress}
    >
      <View
        style={[
          styles.overlay,
          {
            backgroundColor: isDark
              ? "rgba(0, 0, 0, 0.6)"
              : "rgba(0, 0, 0, 0.5)",
          },
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
});

