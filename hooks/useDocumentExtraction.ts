import { useSocket } from "@/hooks/useSocket";
import {
  DocumentCase,
  Extraction,
  FoundDocumentCaseFormData,
  ProgressEvent,
} from "@/types/cases";
import { useCallback, useMemo } from "react";

export const useDocumentExtraction = () => {
  const { publishEventWithAck, socketRef, addEventListener } = useSocket({
    withAuth: true,
    nameSpace: "/extraction",
  });

  const startExtraction = useCallback(async () => {
    if (socketRef.current?.connected) {
      const extraction = await publishEventWithAck<Extraction>("start");
      return extraction;
    }
    return undefined;
  }, [publishEventWithAck, socketRef]);

  const extract = useCallback(
    async (extractionId: string, payload: FoundDocumentCaseFormData) => {
      if (socketRef.current?.connected) {
        const documentCase = await publishEventWithAck<DocumentCase>(
          "extract",
          {
            ...payload,
            extractionId,
          }
        );
        return documentCase;
      }
      return undefined;
    },
    [publishEventWithAck, socketRef]
  );

  return {
    startExtraction,
    extract,
    socketRef,
    addEventListener,
  };
};
const TOTAL_EVENTS = 10;
export const useProcessExtractionProgress = (events: ProgressEvent[]) => {
  const percentage = useMemo(() => {
    return (events.length / TOTAL_EVENTS) * 100;
  }, [events]);
  const error = useMemo(() => events.find((e) => e.state.error), [events]);
  return { percentage, error };
};
