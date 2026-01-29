import { Box } from "@/components/ui/box";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { StyleSheet, View } from "react-native";

interface BottomSheetProps {
  /** Content to render inside the bottom sheet */
  children: React.ReactNode;
  /** Optional custom className for the content container */
  contentClassName?: string;
}

/**
 * BottomSheet Container Component
 * 
 * Provides a reusable bottom sheet container with:
 * - Drag indicator at the top
 * - Rounded top corners
 * - Theme-aware styling
 * - Proper positioning and sizing
 * 
 * @example
 * ```tsx
 * <BottomSheet>
 *   <YourContent />
 * </BottomSheet>
 * ```
 */
export default function BottomSheet({
  children,
  contentClassName,
}: BottomSheetProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View style={styles.container}>
      {/* Drag indicator - visual cue for bottom sheet */}
      <View
        style={[
          styles.dragIndicator,
          {
            backgroundColor: isDark ? "#666" : "#D4D4D4",
          },
        ]}
      />
      {/* Content container with rounded top corners */}
      <Box
        className={`w-full bg-background-0 rounded-t-3xl ${contentClassName || ""}`}
      >
        {children}
      </Box>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
  },
  dragIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 8,
  },
});

