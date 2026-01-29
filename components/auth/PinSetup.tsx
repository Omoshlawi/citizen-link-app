import Toaster from "@/components/toaster";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import PinInputComponent from "@/components/ui/pin-input";
import { Text } from "@/components/ui/text";
import { useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { PIN_LENGTH, PIN_MIN_LENGTH } from "@/constants/schemas";
import {
  checkBiometricAvailability,
  setBiometricEnabled,
  setupPin,
} from "@/lib/local-auth";
import { useEffect, useState } from "react";

interface PinSetupProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export default function PinSetup({ onComplete, onSkip }: PinSetupProps) {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [step, setStep] = useState<"pin" | "confirm">("pin");
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showBiometricDialog, setShowBiometricDialog] = useState(false);
  const toast = useToast();

  useEffect(() => {
    checkBiometric();
  }, []);

  const checkBiometric = async () => {
    const status = await checkBiometricAvailability();
    setBiometricAvailable(status.hasBiometrics);
  };

  const handlePinSubmit = () => {
    if (pin.length < PIN_MIN_LENGTH) {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          return (
            <Toaster
              uniqueToastId={uniqueToastId}
              variant="outline"
              title="Invalid PIN"
              description={`PIN must be at least ${PIN_MIN_LENGTH} digits`}
              action="error"
            />
          );
        },
      });
      return;
    }
    setStep("confirm");
  };

  const handleConfirmPin = async () => {
    if (pin !== confirmPin) {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          return (
            <Toaster
              uniqueToastId={uniqueToastId}
              variant="outline"
              title="PIN Mismatch"
              description="PINs do not match. Please try again."
              action="error"
            />
          );
        },
      });
      setPin("");
      setConfirmPin("");
      setStep("pin");
      return;
    }

    setIsLoading(true);
    try {
      const success = await setupPin(pin);
      if (success) {
        // If biometrics are available, ask if user wants to enable them
        if (biometricAvailable) {
          setShowBiometricDialog(true);
        } else {
          onComplete();
        }
      } else {
        toast.show({
          placement: "top",
          render: ({ id }) => {
            const uniqueToastId = "toast-" + id;
            return (
              <Toaster
                uniqueToastId={uniqueToastId}
                variant="outline"
                title="Error"
                description="Failed to set up PIN. Please try again."
                action="error"
              />
            );
          },
        });
      }
    } catch {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          return (
            <Toaster
              uniqueToastId={uniqueToastId}
              variant="outline"
              title="Error"
              description="An error occurred. Please try again."
              action="error"
            />
          );
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricSkip = async () => {
    await setBiometricEnabled(false);
    setShowBiometricDialog(false);
    onComplete();
  };

  const handleBiometricEnable = async () => {
    await setBiometricEnabled(true);
    setShowBiometricDialog(false);
    onComplete();
  };

  return (
    <Box className="flex-1 items-center justify-center p-4 bg-background-100">
      <FormControl className="p-4 border border-outline-200 rounded-lg w-full bg-background-50">
        <VStack space="lg">
          <Text className="text-2xl font-bold text-center mb-2">
            {step === "pin" ? "Set Up PIN" : "Confirm PIN"}
          </Text>
          <Text className="text-sm text-center text-typography-500 mb-4">
            {step === "pin"
              ? `Create a ${PIN_MIN_LENGTH}-${PIN_LENGTH} digit PIN for secure access`
              : "Re-enter your PIN to confirm"}
          </Text>
          <Box className="items-center justify-center w-full px-2">
            <PinInputComponent
              value={step === "pin" ? pin : confirmPin}
              onChangeText={step === "pin" ? setPin : setConfirmPin}
              length={PIN_LENGTH}
              obscureText={true}
              size="md"
              variant="outline"
              autoFocus={true}
              spacing="sm"
            />
          </Box>
          <VStack space="sm">
            <Button
              onPress={step === "pin" ? handlePinSubmit : handleConfirmPin}
              disabled={
                isLoading ||
                (step === "pin"
                  ? pin.length < PIN_MIN_LENGTH
                  : confirmPin.length < PIN_MIN_LENGTH || pin !== confirmPin)
              }
            >
              <ButtonText size="lg" className="text-background-100">
                {step === "pin" ? "Continue" : "Confirm"}
              </ButtonText>
            </Button>
            {onSkip && step === "pin" && (
              <Button variant="outline" onPress={onSkip} disabled={isLoading}>
                <ButtonText size="lg">Skip</ButtonText>
              </Button>
            )}
          </VStack>
        </VStack>
      </FormControl>
      <AlertDialog
        isOpen={showBiometricDialog}
        onClose={() => setShowBiometricDialog(false)}
        title="Enable Biometric Authentication?"
        message="Would you like to use fingerprint or face ID for faster login?"
        confirmText="Enable"
        cancelText="Skip"
        onConfirm={handleBiometricEnable}
        onCancel={handleBiometricSkip}
      />
    </Box>
  );
}
