import { useDocumentExtraction } from "@/hooks/useDocumentExtraction";
import {
  ConfidenceScore,
  Document,
  DocumentCase,
  Extraction,
  FoundDocumentCaseFormData,
  ImageAnalysisResult,
  ProgressEvent,
  SecurityQuestion,
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
import {
  DataExtractionConfidenceScore,
  DataExtractionStep,
  ImageAnalysis,
} from "./DataExtractionStep";
import ProgressEventStep from "./ProgressEventStep";

interface ExtractionModalProps {
  extraction: Extraction;
  onExtractionComplete: (documentCase: DocumentCase) => void;
  data: FoundDocumentCaseFormData;
}

const ExtractionModal: FC<ExtractionModalProps> = ({
  data,
  extraction,
  onExtractionComplete,
}) => {
  const [progressEvents, setProgressEvents] = useState<ProgressEvent[]>([]);
  const { extract, socketRef, addEventListener } = useDocumentExtraction();
  const hasExtractedRef = useRef(false);
  const [docCase, setDoccase] = useState<DocumentCase>();

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
                    {Math.round(40)}%{/* TODO: CALCULATE PERCENTAGE */}
                  </Text>
                </HStack>
                <Progress value={46} className="w-full" size="sm">
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
                step="DATA_EXTRACTION"
                title="Data Extraction"
                renderDescription={(status) =>
                  status === "completed"
                    ? "Data Extraction Complete"
                    : status === "error"
                    ? "Error Extracting data"
                    : status === "loading"
                    ? "Extracting data from image"
                    : "Pending data extraction"
                }
                renderData={(data) => {
                  if (data) {
                    return (
                      <AiInteractionStep<Document>
                        aiInteraction={data}
                        renderParsedResponse={(parsedData) => (
                          <DataExtractionStep document={parsedData} />
                        )}
                      />
                    );
                  }
                }}
              />
              <ProgressEventStep
                events={progressEvents}
                step="SECURITY_QUESTIONS"
                title="Security Question Generation"
                renderDescription={(status) =>
                  status === "completed"
                    ? "Security Questions generation Complete"
                    : status === "error"
                    ? "Error generating Security Question"
                    : status === "loading"
                    ? "Generating sequrity questions"
                    : "Pending security question generation"
                }
                renderData={(data) => {
                  if (data) {
                    return (
                      <AiInteractionStep<{ questions: SecurityQuestion[] }>
                        aiInteraction={data}
                        renderParsedResponse={({ questions }) => (
                          <Card className="p-2 mt-2">
                            {questions.map((q, i) => (
                              <Text key={i}>
                                {i + 1}.{q.question}({q.answer})
                              </Text>
                            ))}
                          </Card>
                        )}
                      />
                    );
                  }
                }}
              />
              <ProgressEventStep
                events={progressEvents}
                step="CONFIDENCE_SCORE"
                title="Confidence Scoring"
                renderDescription={(status) =>
                  status === "completed"
                    ? "Confidence scoring Complete"
                    : status === "error"
                    ? "Error validating image"
                    : status === "loading"
                    ? "Confidence scoring"
                    : "Pending Validation"
                }
                renderData={(data) => {
                  if (data) {
                    return (
                      <AiInteractionStep<ConfidenceScore>
                        aiInteraction={data}
                        renderParsedResponse={(confidenceScore) => (
                          <DataExtractionConfidenceScore
                            confidenceScore={confidenceScore}
                          />
                        )}
                      />
                    );
                  }
                }}
              />
              <ProgressEventStep
                events={progressEvents}
                step="IMAGE_ANALYSIS"
                title="Image Analysis"
                renderDescription={(status) =>
                  status === "completed"
                    ? "Image analysis Complete"
                    : status === "error"
                    ? "Error analysing image"
                    : status === "loading"
                    ? "Analysing image"
                    : "Pending Validation"
                }
                renderData={(data) => {
                  if (data) {
                    return (
                      <AiInteractionStep<ImageAnalysisResult[]>
                        aiInteraction={data}
                        renderParsedResponse={(analysis) => (
                          <ImageAnalysis analysis={analysis} />
                        )}
                      />
                    );
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
            </>
          )}
        </VStack>
      </ActionsheetContent>
    </Actionsheet>
  );
};

export default ExtractionModal;
