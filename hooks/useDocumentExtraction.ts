import { useSocket } from "@/hooks/useSocket";
import {
  DocumentCase,
  DocumentCaseExtractionFormData,
  Extraction,
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
    async (
      extractionId: string,
      payload: Omit<DocumentCaseExtractionFormData, "extractionId">
    ) => {
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
export const useProcessExtractionProgress = (
  events: ProgressEvent[],
  caseType: DocumentCaseExtractionFormData["caseType"]
) => {
  const TOTAL_EVENTS = caseType === "FOUND" ? 10 : 8;
  const percentage = useMemo(() => {
    return (events.length / TOTAL_EVENTS) * 100;
  }, [TOTAL_EVENTS, events.length]);
  const error = useMemo(() => events.find((e) => e.state.error), [events]);
  return { percentage, error };
};
