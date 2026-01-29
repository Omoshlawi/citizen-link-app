import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";

interface VirtualKeyboardProps {
  /** Callback when a number key is pressed */
  onKeyPress: (key: string) => void;
  /** Callback when biometric button is pressed (optional) */
  onBiometricPress?: () => void;
  /** Callback when delete/backspace button is pressed */
  onDeletePress: () => void;
  /** Whether to show the biometric authentication button */
  showBiometric?: boolean;
  /** Whether the keyboard is disabled */
  disabled?: boolean;
}

/**
 * VirtualKeyboard Component
 *
 * Provides an on-screen virtual keyboard for PIN entry.
 * Replaces the native keyboard to provide a consistent UI experience.
 *
 * Features:
 * - Number keys (0-9) in a 3x3 grid layout
 * - Optional biometric authentication button
 * - Delete/backspace button
 * - Theme-aware styling
 * - Disabled state support
 *
 * Layout:
 * ```
 * [1] [2] [3]
 * [4] [5] [6]
 * [7] [8] [9]
 * [🔐] [0] [⌫]
 * ```
 *
 * @example
 * ```tsx
 * <VirtualKeyboard
 *   onKeyPress={(key) => setPin(pin + key)}
 *   onDeletePress={() => setPin(pin.slice(0, -1))}
 *   onBiometricPress={handleBiometricAuth}
 *   showBiometric={true}
 *   disabled={isLoading}
 * />
 * ```
 */

export default function VirtualKeyboard({
  onKeyPress,
  onBiometricPress,
  onDeletePress,
  showBiometric = false,
  disabled = false,
}: VirtualKeyboardProps) {
  const numberKeys = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
  ];

  const handleKeyPress = (key: string) => {
    if (!disabled) {
      onKeyPress(key);
    }
  };

  const renderKey = (key: string, index: number) => (
    <TouchableOpacity
      key={key}
      onPress={() => handleKeyPress(key)}
      disabled={disabled}
      style={styles.key}
      className="bg-background-100 active:bg-background-200"
      activeOpacity={0.7}
    >
      <Text size="2xl" className="font-bold text-typography-900">
        {key}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Box style={styles.container}>
      {/* Number keys 1-9 */}
      {numberKeys.map((row, rowIndex) => (
        <Box key={rowIndex} style={styles.row}>
          {row.map((key) => renderKey(key, parseInt(key)))}
        </Box>
      ))}

      {/* Bottom row: Biometric/0/Delete */}
      <Box style={styles.row}>
        {showBiometric && onBiometricPress ? (
          <TouchableOpacity
            onPress={onBiometricPress}
            disabled={disabled}
            style={[styles.key, styles.biometricKey]}
            className="bg-success-50 active:bg-success-100"
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="fingerprint"
              size={32}
              color="#14b8a6"
            />
          </TouchableOpacity>
        ) : (
          <Box style={[styles.key, styles.emptyKey]} />
        )}

        <TouchableOpacity
          onPress={() => handleKeyPress("0")}
          disabled={disabled}
          style={styles.key}
          className="bg-background-100 active:bg-background-200"
          activeOpacity={0.7}
        >
          <Text size="2xl" className="font-bold text-typography-900">
            0
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onDeletePress}
          disabled={disabled}
          style={[styles.key, styles.deleteKey]}
          className="bg-error-50 active:bg-error-100"
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="backspace" size={24} color="#dc2626" />
        </TouchableOpacity>
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 10,
  },
  key: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 64,
    maxHeight: 72,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  biometricKey: {
    // Same size as other keys
  },
  deleteKey: {
    // Same size as other keys
  },
  emptyKey: {
    backgroundColor: "transparent",
    elevation: 0,
    shadowOpacity: 0,
  },
});
