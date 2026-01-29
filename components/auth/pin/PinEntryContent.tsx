import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { PIN_LENGTH, PIN_MIN_LENGTH } from "@/constants/schemas";
import PinEntryHeader from "./PinEntryHeader";
import PinInputSection from "./PinInputSection";
import VirtualKeyboard from "../VirtualKeyboard";

interface PinEntryContentProps {
  /** Current PIN value */
  pin: string;
  /** Callback when PIN value changes */
  onPinChange: (pin: string) => void;
  /** Callback when PIN authentication succeeds (receives the PIN value) */
  onSuccess: (pin: string) => void | Promise<void>;
  /** Callback when user cancels (optional) */
  onCancel?: () => void;
  /** Number of failed attempts */
  attempts: number;
  /** Maximum allowed attempts */
  maxAttempts: number;
  /** Whether authentication is in progress */
  isLoading: boolean;
  /** Whether biometric authentication is in progress */
  isBiometricLoading: boolean;
  /** Whether to show biometric button on keyboard */
  showBiometricButton: boolean;
  /** Callback when biometric button is pressed */
  onBiometricPress?: () => void;
}

/**
 * PinEntryContent Component
 * 
 * Displays the PIN entry interface for local authentication.
 * Handles PIN input, validation, and authentication attempts.
 * 
 * Features:
 * - PIN input display
 * - Virtual keyboard with optional biometric button
 * - Attempt counter display
 * - Auto-submit when PIN is complete
 * - Optional cancel button
 * 
 * @example
 * ```tsx
 * <PinEntryContent
 *   pin={pin}
 *   onPinChange={setPin}
 *   onSuccess={handleSuccess}
 *   attempts={attempts}
 *   maxAttempts={5}
 *   isLoading={isLoading}
 *   showBiometricButton={true}
 *   onBiometricPress={handleBiometricAuth}
 * />
 * ```
 */
export default function PinEntryContent({
  pin,
  onPinChange,
  onSuccess,
  onCancel,
  attempts,
  maxAttempts,
  isLoading,
  isBiometricLoading,
  showBiometricButton,
  onBiometricPress,
}: PinEntryContentProps) {
  /**
   * Handles key press from virtual keyboard
   * Only allows input up to PIN_LENGTH
   */
  const handleKeyPress = (key: string) => {
    if (pin.length < PIN_LENGTH) {
      onPinChange(pin + key);
    }
  };

  /**
   * Handles delete/backspace from virtual keyboard
   */
  const handleDelete = () => {
    onPinChange(pin.slice(0, -1));
  };

  /**
   * Handles PIN completion - triggers authentication when PIN is complete
   * This is called by PinInputSection when PIN reaches minimum length
   */
  const handleComplete = async (value: string) => {
    if (value.length >= PIN_MIN_LENGTH) {
      // Pass the PIN value to the success handler
      await onSuccess(value);
    }
  };

  return (
    <VStack space="lg" className="items-center px-4 pb-4">
      {/* Header Section */}
      <PinEntryHeader
        title="Enter PIN"
        subtitle={
          showBiometricButton
            ? "Enter your PIN or use fingerprint"
            : "Enter your PIN to continue"
        }
      />

      {/* PIN Input Display */}
      <PinInputSection
        value={pin}
        onChangeText={onPinChange}
        onComplete={handleComplete}
        isInvalid={attempts > 0}
        disabled={true}
      />

      {/* Attempt Counter */}
      {attempts > 0 && (
        <Text size="sm" className="text-center text-error-500">
          {maxAttempts - attempts} attempts remaining
        </Text>
      )}

      {/* Virtual Keyboard */}
      <Box className="w-full mt-2">
        <VirtualKeyboard
          onKeyPress={handleKeyPress}
          onBiometricPress={onBiometricPress}
          onDeletePress={handleDelete}
          showBiometric={showBiometricButton}
          disabled={isLoading || isBiometricLoading}
        />
      </Box>

      {/* Cancel Button (optional) */}
      {onCancel && (
        <Button
          variant="outline"
          onPress={onCancel}
          disabled={isLoading}
          className="w-full mt-2"
        >
          <ButtonText size="lg">Cancel</ButtonText>
        </Button>
      )}
    </VStack>
  );
}

