import { Box } from "@/components/ui/box";
import PinInputComponent from "@/components/ui/pin-input";
import { PIN_LENGTH } from "@/constants/schemas";

interface PinInputSectionProps {
  /** Current PIN value */
  value: string;
  /** Callback when PIN value changes */
  onChangeText: (value: string) => void;
  /** Callback when PIN is complete (reaches full length) */
  onComplete?: (value: string) => void;
  /** Whether to show error state */
  isInvalid?: boolean;
  /** Whether the input is disabled */
  disabled?: boolean;
}

/**
 * PinInputSection Component
 * 
 * Displays the PIN input field with visual feedback.
 * Handles PIN display only - input is controlled via virtual keyboard.
 * 
 * Features:
 * - Visual PIN boxes with obscured text
 * - Auto-complete detection
 * - Error state indication
 * 
 * @example
 * ```tsx
 * <PinInputSection
 *   value={pin}
 *   onChangeText={setPin}
 *   onComplete={(value) => handleSubmit(value)}
 *   isInvalid={hasError}
 * />
 * ```
 */
export default function PinInputSection({
  value,
  onChangeText,
  onComplete,
  isInvalid = false,
  disabled = true,
}: PinInputSectionProps) {
  return (
    <Box className="items-center justify-center w-full px-2 mb-2">
      <PinInputComponent
        value={value}
        onChangeText={onChangeText}
        onComplete={onComplete}
        length={PIN_LENGTH}
        obscureText={true}
        size="md"
        variant="outline"
        isInvalid={isInvalid}
        autoFocus={false}
        spacing="sm"
        disabled={disabled}
      />
    </Box>
  );
}

