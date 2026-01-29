import { useLocalAuth } from "@/hooks/use-local-auth";
import { useEffect, useState } from "react";
import { Modal } from "react-native";
import BottomSheet from "./bottom-sheet/BottomSheet";
import BottomSheetBackdrop from "./bottom-sheet/BottomSheetBackdrop";
import PinEntry from "./PinEntry";

interface LocalAuthModalProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** Callback when authentication succeeds */
  onSuccess: () => void;
}

/**
 * LocalAuthModal Component
 *
 * Main modal component for local authentication when app regains focus.
 * Displays PIN entry interface in a bottom sheet format.
 *
 * Responsibilities:
 * - Manages modal visibility and lifecycle
 * - Checks local auth status and setup
 * - Displays PIN entry interface when PIN is configured
 * - Handles authentication success
 *
 * Flow:
 * 1. Modal becomes visible (triggered by app state change)
 * 2. Refresh local auth status
 * 3. If PIN is set up, show PIN entry
 * 4. If no PIN, allow access (local auth not configured)
 *
 * @example
 * ```tsx
 * <LocalAuthModal
 *   visible={showModal}
 *   onSuccess={() => setShowModal(false)}
 * />
 * ```
 */
export default function LocalAuthModal({
  visible,
  onSuccess,
}: LocalAuthModalProps) {
  // Local auth status and loading state
  const { status, isLoading, refresh } = useLocalAuth();
  // Whether to show PIN entry interface
  const [showPinEntry, setShowPinEntry] = useState(false);

  /**
   * Refresh local auth status when modal becomes visible
   * Ensures we have the latest status before showing PIN entry
   */
  useEffect(() => {
    if (!visible) {
      setShowPinEntry(false);
      return;
    }

    // Refresh status when modal becomes visible
    refresh();
  }, [visible, refresh]);

  /**
   * Handle status changes and determine what to show
   * Shows PIN entry if PIN is configured, otherwise allows access
   */
  useEffect(() => {
    if (!visible) return;

    // Wait for status to load
    if (!isLoading && status !== null) {
      if (status.hasPin) {
        // PIN is configured - show PIN entry interface
        console.log("Local auth has PIN, showing PIN entry");
        setShowPinEntry(true);
      } else {
        // No PIN configured - allow access (local auth not set up)
        console.log("Local auth not set up, allowing access");
        setShowPinEntry(false);
        onSuccess();
      }
    }
  }, [visible, isLoading, status, onSuccess]);

  /**
   * Handle successful PIN authentication
   * Reset state and call success callback
   */
  const handlePinSuccess = () => {
    setShowPinEntry(false);
    onSuccess();
  };

  // Don't render if modal is not visible
  if (!visible) return null;

  // Don't render if still loading or no PIN entry needed
  if (!showPinEntry) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={() => {
        // Prevent closing - user must authenticate for security
      }}
    >
      {/* Backdrop overlay - prevents interaction with background */}
      <BottomSheetBackdrop />

      {/* Bottom sheet container with PIN entry */}
      <BottomSheet>
        <PinEntry
          onSuccess={handlePinSuccess}
          showBiometricButton={status?.isBiometricEnabled || false}
        />
      </BottomSheet>
    </Modal>
  );
}
