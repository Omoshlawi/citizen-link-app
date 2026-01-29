import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { ActivityIndicator } from "react-native";

interface BiometricPromptProps {
  /** Whether authentication is in progress */
  isLoading: boolean;
  /** Callback when user wants to authenticate with biometrics */
  onAuthenticate: () => void;
  /** Callback when user wants to skip biometric setup */
  onSkip: () => void;
  /** Callback when user wants to cancel */
  onCancel: () => void;
}

/**
 * BiometricPrompt Component
 * 
 * Displays the biometric authentication prompt step during local auth setup.
 * Allows users to enable biometric authentication or skip to PIN setup.
 * 
 * Features:
 * - Biometric authentication button
 * - Skip option to proceed to PIN setup
 * - Cancel option to abort setup
 * - Loading state during authentication
 * 
 * @example
 * ```tsx
 * <BiometricPrompt
 *   isLoading={isAuthenticating}
 *   onAuthenticate={handleBiometricAuth}
 *   onSkip={() => setStep("pin")}
 *   onCancel={handleCancel}
 * />
 * ```
 */
export default function BiometricPrompt({
  isLoading,
  onAuthenticate,
  onSkip,
  onCancel,
}: BiometricPromptProps) {
  return (
    <VStack space="lg" className="items-center px-4 pb-4 pt-2">
      <Text
        size="2xl"
        className="font-bold text-center text-typography-900"
      >
        Enable Biometric Authentication
      </Text>
      <Text size="sm" className="text-center text-typography-500">
        Use your fingerprint or face ID to secure your account.
        You&apos;ll also need to set up a PIN as backup.
      </Text>
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <VStack space="sm" className="w-full">
          <Button onPress={onAuthenticate} disabled={isLoading}>
            <ButtonText size="lg" className="text-background-100">
              Authenticate with Biometrics
            </ButtonText>
          </Button>
          <Button variant="outline" onPress={onSkip} disabled={isLoading}>
            <ButtonText size="lg">Skip Biometrics</ButtonText>
          </Button>
          <Button variant="outline" onPress={onCancel} disabled={isLoading}>
            <ButtonText size="lg">Cancel</ButtonText>
          </Button>
        </VStack>
      )}
    </VStack>
  );
}

