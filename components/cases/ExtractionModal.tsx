import {
  useDocumentExtraction,
  useProcessExtractionProgress,
} from "@/hooks/useDocumentExtraction";
import {
  DocumentCase,
  DocumentCaseExtractionFormData,
  Extraction,
  ExtractionProgressEvent,
  TextExtractionOutput,
  VisionExtractionOutput,
} from "@/types/cases";
import { ArrowRight } from "lucide-react-native";
import React, { FC, useEffect, useRef, useState } from "react";
import { Button } from "../button";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
} from "../ui/actionsheet";
import { Badge, BadgeText } from "../ui/badge";
import { Box } from "../ui/box";
import { Card } from "../ui/card";
import { HStack } from "../ui/hstack";
import { Progress, ProgressFilledTrack } from "../ui/progress";
import { Spinner } from "../ui/spinner";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
import AiInteractionStep from "./AiInteractionStep";
import ProgressEventStep from "./ProgressEventStep";

interface ExtractionModalProps {
  extraction: Extraction;
  onExtractionComplete: (documentCase: DocumentCase) => void;
  data: Omit<DocumentCaseExtractionFormData, "extractionId">;
  onClose: () => void;
}

const ExtractionModal: FC<ExtractionModalProps> = ({
  data,
  extraction,
  onExtractionComplete,
  onClose,
}) => {
  const [progressEvents, setProgressEvents] = useState<
    ExtractionProgressEvent[]
  >([]);
  const { percentage, error } = useProcessExtractionProgress(
    progressEvents,
    data.caseType,
  );
  const { extract, socketRef, addEventListener } = useDocumentExtraction();
  const hasExtractedRef = useRef(false);
  const [docCase, setDoccase] = useState<DocumentCase>();

  useEffect(() => {
    const cleanup = addEventListener(
      `stream_progress:${extraction.id}`,
      (progressData: ExtractionProgressEvent) => {
        console.log(progressData);
        setProgressEvents((p) => [...p, progressData]);
      },
    );

    return cleanup;
  }, [extraction.id, addEventListener]);

  // // Start extraction once when component mounts
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
        setDoccase(docCase);
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

  return (
    <Actionsheet isOpen={true} onClose={() => {}}>
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <VStack className="w-full items-center" space="sm">
          <Card variant="elevated" className="w-full rounded-none">
            <VStack space="sm">
              <HStack space="sm" className="justify-between items-center">
                <Text className="text-lg font-semibold">
                  Document Extraction Progress
                </Text>
                <Badge
                  variant="solid"
                  action={socketRef.current?.connected ? "success" : "error"}
                >
                  <BadgeText>
                    {socketRef.current?.connected
                      ? "Connected"
                      : "Disconnected"}
                  </BadgeText>
                </Badge>
              </HStack>

              <Box className="w-full">
                <HStack space="sm" className="justify-between items-center">
                  <Text className="text-sm text-typography-500">
                    Overall Progress
                  </Text>
                  <Text className="text-sm font-medium">
                    {Math.round(percentage)}%
                  </Text>
                </HStack>
                <Progress value={percentage} className="w-full" size="sm">
                  <ProgressFilledTrack className="bg-teal-500" />
                </Progress>
              </Box>
            </VStack>
          </Card>

          {progressEvents.length === 0 ? (
            <Card variant="elevated" className="w-full">
              <HStack space="sm" className="justify-center items-center">
                <Spinner />
                <Text className="text-md text-typography-500">
                  Waiting for extraction to start...
                </Text>
              </HStack>
            </Card>
          ) : (
            <>
              <ProgressEventStep
                step="IMAGE_VALIDATION"
                events={progressEvents}
                title="Image Validation"
                renderDescription={(status) =>
                  status === "completed"
                    ? "Image Validation Complete"
                    : status === "error"
                      ? "Error validating image"
                      : status === "loading"
                        ? "Validating image"
                        : "Pending Validation"
                }
                renderData={(data) => {
                  if (data) {
                    return <Text>{data}</Text>;
                  }
                }}
              />

              <ProgressEventStep
                events={progressEvents}
                step="VISION_EXTRACTION"
                title="Vision Extraction"
                renderDescription={(status) =>
                  status === "completed"
                    ? "Vision Extraction Complete"
                    : status === "error"
                      ? "Error Extracting Vision"
                      : status === "loading"
                        ? "Extracting Vision"
                        : "Pending Vision Extraction"
                }
                renderData={(data) => {
                  if (data) {
                    return (
                      <AiInteractionStep<VisionExtractionOutput>
                        aiInteraction={data}
                        renderParsedResponse={(parsedData) => (
                          <Text>{JSON.stringify(parsedData, null, 2)}</Text>
                        )}
                      />
                    );
                  }
                }}
              />

              <ProgressEventStep
                events={progressEvents}
                step="TEXT_EXTRACTION"
                title="Text Extraction"
                renderDescription={(status) =>
                  status === "completed"
                    ? "Text Extraction Complete"
                    : status === "error"
                      ? "Error Extracting Text"
                      : status === "loading"
                        ? "Extracting Text"
                        : "Pending Text Extraction"
                }
                renderData={(data) => {
                  if (data) {
                    return (
                      <AiInteractionStep<TextExtractionOutput>
                        aiInteraction={data}
                        renderParsedResponse={(parsedData) => (
                          <Text>{JSON.stringify(parsedData, null, 2)}</Text>
                        )}
                      />
                    );
                  }
                }}
              />
              <ProgressEventStep
                events={progressEvents}
                step="DOCUMENT_TYPE_VALIDATION"
                title="Document Type Validation"
                renderDescription={(status) =>
                  status === "completed"
                    ? "Document Type Validation Complete"
                    : status === "error"
                      ? "Error Validating Document Type"
                      : status === "loading"
                        ? "Validating Document Type"
                        : "Pending Document Type Validation"
                }
                renderData={(data) => {
                  if (data) {
                    return <Text>{data}</Text>;
                  }
                }}
              />

              {!!docCase && (
                <Button
                  text="Continue"
                  suffixIcon={ArrowRight}
                  onPress={() => onExtractionComplete(docCase)}
                />
              )}
              {!!error && (
                <Button
                  text="Retry"
                  suffixIcon={ArrowRight}
                  onPress={() => onClose()}
                />
              )}
            </>
          )}
        </VStack>
      </ActionsheetContent>
    </Actionsheet>
  );
};

export default ExtractionModal;
