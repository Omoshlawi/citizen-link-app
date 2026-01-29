import Toaster from "@/components/toaster";
import { useToast } from "@/components/ui/toast";
import {
  authenticateWithBiometrics,
  checkBiometricAvailability,
  setBiometricEnabled,
  setupPin,
} from "@/lib/local-auth";
import { useEffect, useState } from "react";
import { Keyboard } from "react-native";
import BottomSheet from "./bottom-sheet/BottomSheet";
import BiometricPrompt from "./setup/BiometricPrompt";
import PinConfirmStep from "./setup/PinConfirmStep";
import PinSetupStep from "./setup/PinSetupStep";

interface LocalAuthSetupProps {
  /** Callback when setup is complete */
  onComplete: () => void;
  /** Callback when setup is cancelled */
  onCancel: () => void;
}

/**
 * LocalAuthSetup Component
 *
 * Main orchestrator for local authentication setup flow.
 * Manages multi-step setup process: biometric → PIN → confirm.
 *
 * Flow:
 * 1. Biometric prompt (if available) - optional step
 * 2. PIN setup - create new PIN
 * 3. PIN confirmation - verify PIN matches
 *
 * Responsibilities:
 * - Manages setup flow state and navigation
 * - Handles biometric authentication
 * - Validates PIN creation and confirmation
 * - Stores PIN securely after successful setup
 *
 * @example
 * ```tsx
 * <LocalAuthSetup
 *   onComplete={() => console.log("Setup complete")}
 *   onCancel={() => console.log("Setup cancelled")}
 * />
 * ```
 */
export default function LocalAuthSetup({
  onComplete,
  onCancel,
}: LocalAuthSetupProps) {
  const toast = useToast();
  // Current step in the setup flow
  const [step, setStep] = useState<"biometric" | "pin" | "confirm">(
    "biometric"
  );
  // PIN value during setup
  const [pin, setPin] = useState("");
  // Confirmation PIN value
  const [confirmPin, setConfirmPin] = useState("");
  // Loading state for async operations
  const [isLoading, setIsLoading] = useState(false);
  // Whether biometric authentication is available on device
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  // Whether we're still checking biometric availability
  const [isCheckingBiometric, setIsCheckingBiometric] = useState(true);

  /**
   * Check biometric availability on mount
   * Dismiss native keyboard to force virtual keyboard usage
   */
  useEffect(() => {
    checkBiometric();
    Keyboard.dismiss();
  }, []);

  /**
   * Checks if biometric authentication is available on the device
   * Skips biometric step if not available
   */
  const checkBiometric = async () => {
    setIsCheckingBiometric(true);
    try {
      const status = await checkBiometricAvailability();
      setBiometricAvailable(status.hasBiometrics);

      // Skip biometric step if not available
      if (!status.hasBiometrics) {
        setStep("pin");
      }
    } finally {
      setIsCheckingBiometric(false);
    }
  };

  /**
   * Handles biometric authentication during setup
   * Enables biometric auth if successful, proceeds to PIN setup
   */
  const handleBiometricAuth = async () => {
    setIsLoading(true);
    try {
      const success = await authenticateWithBiometrics();
      if (success) {
        // Enable biometric authentication and proceed to PIN setup
        await setBiometricEnabled(true);
        setStep("pin");
      } else {
        toast.show({
          placement: "top",
          render: ({ id }) => {
            const uniqueToastId = "toast-" + id;
            return (
              <Toaster
                uniqueToastId={uniqueToastId}
                variant="outline"
                title="Biometric Authentication Failed"
                description="Please try again or continue with PIN setup."
                action="error"
              />
            );
          },
        });
      }
    } catch (err) {
      console.error("Biometric auth error:", err);
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          return (
            <Toaster
              uniqueToastId={uniqueToastId}
              variant="outline"
              title="Error"
              description="Biometric authentication failed. You can continue with PIN setup."
              action="error"
            />
          );
        },
      });
      setStep("pin");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles PIN setup completion
   * Validates PIN length and proceeds to confirmation step
   */
  const handlePinSubmit = () => {
    // Validation is handled by PinSetupStep component
    // This is called when PIN reaches full length
    setStep("confirm");
  };

  /**
   * Handles PIN confirmation and final setup
   * Validates PINs match and stores PIN securely
   */
  const handleConfirmPin = async () => {
    // Validate PINs match
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
      // Store PIN securely
      const pinSuccess = await setupPin(pin);
      if (pinSuccess) {
        // Setup complete - call completion callback
        onComplete();
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

  // Show loading state while checking biometric availability
  if (isCheckingBiometric) {
    return (
      <BottomSheet>
        <BiometricPrompt
          isLoading={true}
          onAuthenticate={() => {}}
          onSkip={() => {}}
          onCancel={onCancel}
        />
      </BottomSheet>
    );
  }

  // Render biometric prompt step
  if (step === "biometric" && biometricAvailable) {
    return (
      <BottomSheet>
        <BiometricPrompt
          isLoading={isLoading}
          onAuthenticate={handleBiometricAuth}
          onSkip={() => setStep("pin")}
          onCancel={onCancel}
        />
      </BottomSheet>
    );
  }

  // Render PIN setup step
  if (step === "pin") {
    return (
      <BottomSheet>
        <PinSetupStep
          pin={pin}
          onPinChange={setPin}
          onComplete={handlePinSubmit}
          onCancel={onCancel}
          isLoading={isLoading}
        />
      </BottomSheet>
    );
  }

  // Render PIN confirmation step
  return (
    <BottomSheet>
      <PinConfirmStep
        originalPin={pin}
        confirmPin={confirmPin}
        onConfirmPinChange={setConfirmPin}
        onComplete={handleConfirmPin}
        onBack={() => {
          setStep("pin");
          setConfirmPin("");
        }}
        isLoading={isLoading}
      />
    </BottomSheet>
  );
}
