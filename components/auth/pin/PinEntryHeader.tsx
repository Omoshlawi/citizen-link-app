import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

interface PinEntryHeaderProps {
  /** Main title text */
  title: string;
  /** Subtitle/description text */
  subtitle: string;
}

/**
 * PinEntryHeader Component
 * 
 * Displays the header section for PIN entry screens.
 * Provides consistent styling for title and subtitle.
 * 
 * @example
 * ```tsx
 * <PinEntryHeader
 *   title="Enter PIN"
 *   subtitle="Enter your PIN to continue"
 * />
 * ```
 */
export default function PinEntryHeader({
  title,
  subtitle,
}: PinEntryHeaderProps) {
  return (
    <VStack space="sm" className="items-center mb-2">
      <Text
        size="2xl"
        className="font-bold text-center text-typography-900"
      >
        {title}
      </Text>
      <Text size="sm" className="text-center text-typography-500">
        {subtitle}
      </Text>
    </VStack>
  );
}

