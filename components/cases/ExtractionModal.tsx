import { useDocumentExtraction } from "@/hooks/useDocumentExtraction";
import {
  DocumentCase,
  Extraction,
  FoundDocumentCaseFormData,
  ProgressEvent,
} from "@/types/cases";
import { FC, useEffect, useRef, useState } from "react";
import { Modal } from "react-native";
import { BottomSheet, BottomSheetBackdrop } from "../bottom-sheet";
import { VStack } from "../ui/vstack";

interface ExtractionModalProps {
  /** Whether the modal is visible */
  visible: boolean;
  extraction: Extraction;
  onExtractionComplete: (documentCase: DocumentCase) => void;
  data: FoundDocumentCaseFormData;
}

const ExtractionModal: FC<ExtractionModalProps> = ({
  data,
  extraction,
  onExtractionComplete,
  visible,
}) => {
  const [progressEvents, setProgressEvents] = useState<ProgressEvent[]>([]);
  const { extract, socketRef, addEventListener } = useDocumentExtraction();
  const hasExtractedRef = useRef(false);

  useEffect(() => {
    const cleanup = addEventListener(
      `stream_progress:${extraction.id}`,
      (progressData: ProgressEvent) => {
        console.log(progressData);
        setProgressEvents((p) => [...p, progressData]);
      }
    );

    return cleanup;
  }, [extraction.id, addEventListener]);

  // Start extraction once when component mounts
  useEffect(() => {
    if (hasExtractedRef.current) {
      return;
    }

    let connectionCheckInterval: number | null = null;
    let timeoutId: number | null = null;

    const performExtraction = async () => {
      // Wait for socket to be connected
      if (!socketRef.current?.connected) {
        // Wait for connection
        connectionCheckInterval = setInterval(() => {
          if (socketRef.current?.connected) {
            if (connectionCheckInterval) {
              clearInterval(connectionCheckInterval);
              connectionCheckInterval = null;
            }
            if (timeoutId) {
              clearTimeout(timeoutId);
              timeoutId = null;
            }
            performExtraction();
          }
        }, 100);

        // Cleanup interval after 10 seconds
        timeoutId = setTimeout(() => {
          if (connectionCheckInterval) {
            clearInterval(connectionCheckInterval);
            connectionCheckInterval = null;
          }
        }, 10000);
        return;
      }

      hasExtractedRef.current = true;
      const docCase = await extract(extraction.id, data);
      if (docCase) {
        // TODO: uncoment
        // onExtractionComplete(docCase);
      }
    };

    performExtraction();

    return () => {
      if (connectionCheckInterval) {
        clearInterval(connectionCheckInterval);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [extract, extraction.id, data, onExtractionComplete, socketRef]);

  // Don't render if modal is not visible
  if (!visible) return null;
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={() => {
        // Prevent closing - user must WAIT FOR EXTRACTION PROCESS TO COMPLETE
      }}
    >
      {/* Backdrop overlay - prevents interaction with background */}
      <BottomSheetBackdrop />

      {/* Bottom sheet container DISPLAYING PROGRESS */}
      <BottomSheet>
        <VStack space="sm">

        </VStack>
      </BottomSheet>
    </Modal>
  );
};

export default ExtractionModal;
