import Toaster from "@/components/toaster";
import { useToast } from "@/components/ui/toast";
import { PIN_MIN_LENGTH } from "@/constants/schemas";
import {
  authenticateWithBiometrics,
  authenticateWithPin,
} from "@/lib/local-auth";
import { useEffect, useState } from "react";
import { Keyboard } from "react-native";
import PinEntryContent from "./pin/PinEntryContent";

interface PinEntryProps {
  /** Callback when authentication succeeds */
  onSuccess: () => void;
  /** Callback when user cancels (optional) */
  onCancel?: () => void;
  /** Maximum number of authentication attempts before locking out */
  maxAttempts?: number;
  /** Whether to show biometric authentication button */
  showBiometricButton?: boolean;
}

/**
 * PinEntry Component
 *
 * Main component for PIN-based authentication during local auth flow.
 * Handles PIN entry, validation, and authentication logic.
 *
 * Responsibilities:
 * - Manages PIN state and authentication attempts
 * - Handles PIN validation and authentication
 * - Manages biometric authentication fallback
 * - Tracks failed attempts and enforces limits
 *
 * @example
 * ```tsx
 * <PinEntry
 *   onSuccess={() => console.log("Authenticated")}
 *   showBiometricButton={true}
 *   maxAttempts={5}
 * />
 * ```
 */
export default function PinEntry({
  onSuccess,
  onCancel,
  maxAttempts = 5,
  showBiometricButton = false,
}: PinEntryProps) {
  // PIN input state
  const [pin, setPin] = useState("");
  // Track failed authentication attempts
  const [attempts, setAttempts] = useState(0);
  // Loading state for PIN authentication
  const [isLoading, setIsLoading] = useState(false);
  // Loading state for biometric authentication
  const [isBiometricLoading, setIsBiometricLoading] = useState(false);
  const toast = useToast();

  /**
   * Dismiss native keyboard when component mounts
   * Forces use of virtual keyboard
   */
  useEffect(() => {
    Keyboard.dismiss();
  }, []);

  /**
   * Handles PIN submission and authentication
   * Validates PIN length and authenticates against stored PIN
   */
  const handleSubmit = async (pinValue?: string) => {
    const pinToCheck = pinValue || pin;

    // Validate minimum PIN length
    if (pinToCheck.length < PIN_MIN_LENGTH) {
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

    setIsLoading(true);
    try {
      // Attempt authentication with provided PIN
      const success = await authenticateWithPin(pinToCheck);

      if (success) {
        // Authentication successful - reset state and call success callback
        setAttempts(0);
        setPin("");
        onSuccess();
      } else {
        // Authentication failed - increment attempts and handle lockout
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setPin("");

        if (newAttempts >= maxAttempts) {
          // Maximum attempts reached - lock out user
          toast.show({
            placement: "top",
            render: ({ id }) => {
              const uniqueToastId = "toast-" + id;
              return (
                <Toaster
                  uniqueToastId={uniqueToastId}
                  variant="outline"
                  title="Too Many Attempts"
                  description="You have exceeded the maximum number of attempts. Please try again later."
                  action="error"
                />
              );
            },
          });
          if (onCancel) {
            onCancel();
          }
        } else {
          // Show remaining attempts
          toast.show({
            placement: "top",
            render: ({ id }) => {
              const uniqueToastId = "toast-" + id;
              return (
                <Toaster
                  uniqueToastId={uniqueToastId}
                  variant="outline"
                  title="Incorrect PIN"
                  description={`Incorrect PIN. ${
                    maxAttempts - newAttempts
                  } attempts remaining.`}
                  action="error"
                />
              );
            },
          });
        }
      }
    } catch {
      // Handle unexpected errors
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

  /**
   * Handles biometric authentication
   * Falls back to PIN entry if biometric fails
   */
  const handleBiometricAuth = async () => {
    setIsBiometricLoading(true);
    try {
      const success = await authenticateWithBiometrics();
      if (success) {
        // Biometric authentication successful
        onSuccess();
      } else {
        // Biometric failed - user can continue with PIN
        toast.show({
          placement: "top",
          render: ({ id }) => {
            const uniqueToastId = "toast-" + id;
            return (
              <Toaster
                uniqueToastId={uniqueToastId}
                variant="outline"
                title="Biometric Authentication Failed"
                description="Please use your PIN to continue."
                action="error"
              />
            );
          },
        });
      }
    } catch (error) {
      console.error("Biometric auth error:", error);
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          return (
            <Toaster
              uniqueToastId={uniqueToastId}
              variant="outline"
              title="Error"
              description="Biometric authentication failed. Please use your PIN."
              action="error"
            />
          );
        },
      });
    } finally {
      setIsBiometricLoading(false);
    }
  };

  /**
   * Handles PIN completion from PinEntryContent
   * Auto-submits when PIN reaches minimum length
   */
  const handlePinComplete = async (pinValue: string) => {
    await handleSubmit(pinValue);
  };

  return (
    <PinEntryContent
      pin={pin}
      onPinChange={setPin}
      onSuccess={handlePinComplete}
      onCancel={onCancel}
      attempts={attempts}
      maxAttempts={maxAttempts}
      isLoading={isLoading}
      isBiometricLoading={isBiometricLoading}
      showBiometricButton={showBiometricButton}
      onBiometricPress={showBiometricButton ? handleBiometricAuth : undefined}
    />
  );
}
