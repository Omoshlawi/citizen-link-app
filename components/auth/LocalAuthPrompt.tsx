import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { storeCredentials, setupPin, setBiometricEnabled, checkBiometricAvailability } from "@/lib/local-auth";
import { useState, useEffect } from "react";
import PinSetup from "./PinSetup";

interface LocalAuthPromptProps {
  username: string;
  password: string;
  onComplete: () => void;
  onSkip: () => void;
}

export default function LocalAuthPrompt({
  username,
  password,
  onComplete,
  onSkip,
}: LocalAuthPromptProps) {
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkBiometric();
  }, []);

  const checkBiometric = async () => {
    const status = await checkBiometricAvailability();
    setBiometricAvailable(status.hasBiometrics);
  };

  const handleEnable = async () => {
    setIsLoading(true);
    try {
      // Store credentials first
      await storeCredentials(username, password);
      // Show PIN setup
      setShowPinSetup(true);
    } catch (error) {
      console.error("Error enabling local auth:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinSetupComplete = async () => {
    // Biometric enablement is handled in PinSetup component
    onComplete();
  };

  if (showPinSetup) {
    return <PinSetup onComplete={handlePinSetupComplete} />;
  }

  return (
    <Box className="flex-1 items-center justify-center p-4 bg-background-100">
      <Card className="p-6 w-full max-w-md">
        <VStack space="lg">
          <Text className="text-2xl font-bold text-center">
            Enable Local Authentication?
          </Text>
          <Text className="text-sm text-center text-typography-500">
            {biometricAvailable
              ? "Use fingerprint or face ID for faster, secure login. A PIN will be required as backup."
              : "Set up a PIN for quick and secure access to your account."}
          </Text>
          <VStack space="sm">
            <Button onPress={handleEnable} disabled={isLoading}>
              <ButtonText size="lg" className="text-background-100">
                Enable
              </ButtonText>
            </Button>
            <Button variant="outline" onPress={onSkip} disabled={isLoading}>
              <ButtonText size="lg">Skip</ButtonText>
            </Button>
          </VStack>
        </VStack>
      </Card>
    </Box>
  );
}

