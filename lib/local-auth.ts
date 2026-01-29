import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";

const PIN_KEY = "local_auth_pin";
const BIOMETRIC_ENABLED_KEY = "local_auth_biometric_enabled";
const USERNAME_KEY = "local_auth_username";
const PASSWORD_KEY = "local_auth_password";

export interface LocalAuthStatus {
  hasBiometrics: boolean;
  biometricType: LocalAuthentication.AuthenticationType[];
  isBiometricEnabled: boolean;
  hasPin: boolean;
}

/**
 * Check if biometric authentication is available on the device
 */
export async function checkBiometricAvailability(): Promise<LocalAuthStatus> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  const supportedTypes =
    await LocalAuthentication.supportedAuthenticationTypesAsync();
  const hasPin = !!(await SecureStore.getItemAsync(PIN_KEY));
  const isBiometricEnabled =
    (await SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY)) === "true";

  return {
    hasBiometrics: hasHardware && isEnrolled,
    biometricType: supportedTypes,
    isBiometricEnabled: isBiometricEnabled && hasHardware && isEnrolled,
    hasPin,
  };
}

/**
 * Authenticate using biometrics (fingerprint/face ID)
 */
export async function authenticateWithBiometrics(): Promise<boolean> {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to access your account",
      cancelLabel: "Cancel",
      fallbackLabel: "Use PIN",
      disableDeviceFallback: false,
    });

    return result.success;
  } catch (error) {
    console.error("Biometric authentication error:", error);
    return false;
  }
}

/**
 * Authenticate using PIN
 */
export async function authenticateWithPin(pin: string): Promise<boolean> {
  try {
    const storedPin = await SecureStore.getItemAsync(PIN_KEY);
    return storedPin === pin;
  } catch (error) {
    console.error("PIN authentication error:", error);
    return false;
  }
}

/**
 * Set up PIN for local authentication
 */
export async function setupPin(pin: string): Promise<boolean> {
  try {
    await SecureStore.setItemAsync(PIN_KEY, pin);
    return true;
  } catch (error) {
    console.error("PIN setup error:", error);
    return false;
  }
}

/**
 * Enable or disable biometric authentication
 */
export async function setBiometricEnabled(enabled: boolean): Promise<boolean> {
  try {
    await SecureStore.setItemAsync(
      BIOMETRIC_ENABLED_KEY,
      enabled ? "true" : "false"
    );
    return true;
  } catch (error) {
    console.error("Biometric enable error:", error);
    return false;
  }
}

/**
 * Store user credentials securely (encrypted)
 */
export async function storeCredentials(
  username: string,
  password: string
): Promise<boolean> {
  try {
    await SecureStore.setItemAsync(USERNAME_KEY, username);
    await SecureStore.setItemAsync(PASSWORD_KEY, password);
    return true;
  } catch (error) {
    console.error("Credential storage error:", error);
    return false;
  }
}

/**
 * Retrieve stored credentials
 */
export async function getStoredCredentials(): Promise<{
  username: string | null;
  password: string | null;
}> {
  try {
    const username = await SecureStore.getItemAsync(USERNAME_KEY);
    const password = await SecureStore.getItemAsync(PASSWORD_KEY);
    return { username, password };
  } catch (error) {
    console.error("Credential retrieval error:", error);
    return { username: null, password: null };
  }
}

/**
 * Clear PIN only
 */
export async function clearPin(): Promise<boolean> {
  try {
    await SecureStore.deleteItemAsync(PIN_KEY);
    return true;
  } catch (error) {
    console.error("Clear PIN error:", error);
    return false;
  }
}

/**
 * Clear all local authentication data
 */
export async function clearLocalAuth(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(PIN_KEY);
    await SecureStore.deleteItemAsync(BIOMETRIC_ENABLED_KEY);
    await SecureStore.deleteItemAsync(USERNAME_KEY);
    await SecureStore.deleteItemAsync(PASSWORD_KEY);
  } catch (error) {
    console.error("Clear local auth error:", error);
  }
}

/**
 * Check if local authentication is set up
 */
export async function isLocalAuthSetup(): Promise<boolean> {
  const pin = await SecureStore.getItemAsync(PIN_KEY);
  return !!pin;
}

/**
 * Check if local authentication is enabled (turned on in settings)
 */
export async function isLocalAuthEnabled(): Promise<boolean> {
  const enabled = await SecureStore.getItemAsync("local_auth_enabled");
  return enabled === "true";
}

/**
 * Enable or disable local authentication (toggle in settings)
 */
export async function setLocalAuthEnabled(enabled: boolean): Promise<boolean> {
  try {
    await SecureStore.setItemAsync(
      "local_auth_enabled",
      enabled ? "true" : "false"
    );
    return true;
  } catch (error) {
    console.error("Set local auth enabled error:", error);
    return false;
  }
}

