import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { PIN_LENGTH, PIN_MIN_LENGTH } from "@/constants/schemas";
import PinInputSection from "../pin/PinInputSection";
import VirtualKeyboard from "../VirtualKeyboard";

interface PinConfirmStepProps {
  /** Original PIN value to match against */
  originalPin: string;
  /** Current confirmation PIN value */
  confirmPin: string;
  /** Callback when confirmation PIN value changes */
  onConfirmPinChange: (pin: string) => void;
  /** Callback when PIN confirmation is complete (auto-triggered when PIN matches) */
  onComplete: () => void;
  /** Callback when user wants to go back */
  onBack: () => void;
  /** Whether confirmation is in progress */
  isLoading?: boolean;
}

/**
 * PinConfirmStep Component
 * 
 * Displays the PIN confirmation step during local auth setup.
 * Requires users to re-enter their PIN to confirm it matches.
 * 
 * Features:
 * - PIN input display with validation
 * - Visual error feedback when PINs don't match
 * - Virtual keyboard for PIN entry
 * - Auto-submit when PIN matches and reaches full length
 * - Back button to return to PIN setup
 * 
 * @example
 * ```tsx
 * <PinConfirmStep
 *   originalPin={pin}
 *   confirmPin={confirmPin}
 *   onConfirmPinChange={setConfirmPin}
 *   onComplete={handleConfirm}
 *   onBack={() => setStep("pin")}
 * />
 * ```
 */
export default function PinConfirmStep({
  originalPin,
  confirmPin,
  onConfirmPinChange,
  onComplete,
  onBack,
  isLoading = false,
}: PinConfirmStepProps) {
  /**
   * Checks if the confirmation PIN matches the original PIN
   */
  const isMismatch = confirmPin.length > 0 && confirmPin !== originalPin;

  /**
   * Handles key press from virtual keyboard
   * Only allows input up to PIN_LENGTH
   */
  const handleKeyPress = (key: string) => {
    if (confirmPin.length < PIN_LENGTH) {
      onConfirmPinChange(confirmPin + key);
    }
  };

  /**
   * Handles delete/backspace from virtual keyboard
   */
  const handleDelete = () => {
    onConfirmPinChange(confirmPin.slice(0, -1));
  };

  /**
   * Handles PIN completion - auto-submits when PIN matches and reaches full length
   */
  const handleComplete = (value: string) => {
    if (value.length === PIN_LENGTH && value === originalPin) {
      onComplete();
    }
  };

  return (
    <VStack space="lg" className="items-center px-4 pb-4 pt-2">
      <Text
        size="2xl"
        className="font-bold text-center text-typography-900"
      >
        Confirm PIN
      </Text>
      <Text size="sm" className="text-center text-typography-500">
        Re-enter your PIN to confirm
      </Text>

      {/* PIN Input Display with validation */}
      <PinInputSection
        value={confirmPin}
        onChangeText={onConfirmPinChange}
        onComplete={handleComplete}
        isInvalid={isMismatch}
        disabled={true}
      />

      {/* Error message when PINs don't match */}
      {isMismatch && (
        <Text size="sm" className="text-center text-error-500">
          PINs do not match
        </Text>
      )}

      {/* Virtual Keyboard */}
      <Box className="w-full mt-2">
        <VirtualKeyboard
          onKeyPress={handleKeyPress}
          onDeletePress={handleDelete}
          showBiometric={false}
          disabled={isLoading}
        />
      </Box>

      {/* Back Button */}
      <Button variant="outline" onPress={onBack} disabled={isLoading}>
        <ButtonText size="lg">Back</ButtonText>
      </Button>
    </VStack>
  );
}

