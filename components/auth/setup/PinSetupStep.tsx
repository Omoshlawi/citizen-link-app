import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { PIN_LENGTH, PIN_MIN_LENGTH } from "@/constants/schemas";
import PinInputSection from "../pin/PinInputSection";
import VirtualKeyboard from "../VirtualKeyboard";

interface PinSetupStepProps {
  /** Current PIN value */
  pin: string;
  /** Callback when PIN value changes */
  onPinChange: (pin: string) => void;
  /** Callback when PIN setup is complete (auto-triggered when PIN reaches full length) */
  onComplete: () => void;
  /** Callback when user cancels */
  onCancel: () => void;
  /** Whether setup is in progress */
  isLoading?: boolean;
}

/**
 * PinSetupStep Component
 * 
 * Displays the PIN creation step during local auth setup.
 * Allows users to create a new PIN using the virtual keyboard.
 * 
 * Features:
 * - PIN input display
 * - Virtual keyboard for PIN entry
 * - Auto-submit when PIN reaches full length
 * - Cancel option
 * 
 * @example
 * ```tsx
 * <PinSetupStep
 *   pin={pin}
 *   onPinChange={setPin}
 *   onComplete={() => setStep("confirm")}
 *   onCancel={handleCancel}
 * />
 * ```
 */
export default function PinSetupStep({
  pin,
  onPinChange,
  onComplete,
  onCancel,
  isLoading = false,
}: PinSetupStepProps) {
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
   * Handles PIN completion - auto-submits when PIN reaches full length
   */
  const handleComplete = (value: string) => {
    if (value.length === PIN_LENGTH) {
      onComplete();
    }
  };

  return (
    <VStack space="lg" className="items-center px-4 pb-4 pt-2">
      <Text
        size="2xl"
        className="font-bold text-center text-typography-900"
      >
        Set Up PIN
      </Text>
      <Text size="sm" className="text-center text-typography-500">
        Create a {PIN_MIN_LENGTH}-{PIN_LENGTH} digit PIN for secure access
      </Text>

      {/* PIN Input Display */}
      <PinInputSection
        value={pin}
        onChangeText={onPinChange}
        onComplete={handleComplete}
        disabled={true}
      />

      {/* Virtual Keyboard */}
      <Box className="w-full mt-2">
        <VirtualKeyboard
          onKeyPress={handleKeyPress}
          onDeletePress={handleDelete}
          showBiometric={false}
          disabled={isLoading}
        />
      </Box>

      {/* Cancel Button */}
      <Button variant="outline" onPress={onCancel} disabled={isLoading}>
        <ButtonText size="lg">Cancel</ButtonText>
      </Button>
    </VStack>
  );
}

