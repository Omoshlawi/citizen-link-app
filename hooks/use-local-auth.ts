import { useState, useEffect } from "react";
import {
  checkBiometricAvailability,
  authenticateWithBiometrics,
  authenticateWithPin,
  type LocalAuthStatus,
} from "@/lib/local-auth";

export function useLocalAuth() {
  const [status, setStatus] = useState<LocalAuthStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    setIsLoading(true);
    try {
      const authStatus = await checkBiometricAvailability();
      setStatus(authStatus);
    } catch (error) {
      console.error("Error loading local auth status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const authenticate = async (pin?: string): Promise<boolean> => {
    if (!status) return false;

    // If PIN is provided, authenticate with PIN
    if (pin) {
      return await authenticateWithPin(pin);
    }

    // If biometrics are enabled, try biometric first
    if (status.isBiometricEnabled) {
      const biometricResult = await authenticateWithBiometrics();
      if (biometricResult) {
        return true;
      }
      // If biometric fails, fall back to PIN if available
      if (status.hasPin) {
        return false; // Return false to prompt for PIN
      }
    }

    // If only PIN is available, return false to prompt for PIN
    if (status.hasPin && !status.isBiometricEnabled) {
      return false; // Return false to prompt for PIN
    }

    return false;
  };

  return {
    status,
    isLoading,
    authenticate,
    refresh: loadStatus,
  };
}

