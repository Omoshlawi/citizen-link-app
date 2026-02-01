import {
  AiInteractionProgressEvent,
  ImageValidationEvent,
  ProgressEvent,
} from "@/types/cases";
import { FC, useEffect, useMemo, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Box } from "../ui/box";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { CloseIcon, Icon } from "../ui/icon";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
} from "../ui/modal";
import { Progress, ProgressFilledTrack } from "../ui/progress";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
import { Status, StatusBadge, StatusIcon } from "./status-component";
type ImageValidationProgressEventStepProps = {
  events?: ProgressEvent[];
  step: ImageValidationEvent["key"];
  title: string;
  renderDescription?: (status: Status) => string;
  renderData?: (data: ImageValidationEvent["state"]["data"]) => React.ReactNode;
  showPending?: boolean;
};
type AiInteractionProgressEventStepProps = {
  events?: ProgressEvent[];
  step: AiInteractionProgressEvent["key"];
  title: string;
  renderDescription?: (status: Status) => string;
  renderData?: (
    data: AiInteractionProgressEvent["state"]["data"]
  ) => React.ReactNode;
  showPending?: boolean;
};

type ProgressEventStepProps =
  | ImageValidationProgressEventStepProps
  | AiInteractionProgressEventStepProps;

const ProgressEventStep: FC<ProgressEventStepProps> = ({
  events = [],
  step,
  title,
  renderDescription,
  renderData,
  showPending = true,
}) => {
  const stepEvents = useMemo(
    () => events.filter((e) => e.key === step),
    [events, step]
  );
  const { isLoading, data, error } = useMemo<ProgressEvent["state"]>(() => {
    const hasLoadingState = stepEvents.some((e) => e.state.isLoading);
    const hasErrorState = stepEvents.some((e) => e.state.error);
    const data = stepEvents.find(
      (e) => hasLoadingState && !hasErrorState && e.state.data
    )?.state?.data as any;
    const error = stepEvents.find((e) => hasLoadingState && e.state.error)
      ?.state?.error;
    return {
      isLoading: hasLoadingState && !error && !data,
      data,
      error,
    };
  }, [stepEvents]);
  const [showModal, setShowModal] = useState(false);
  const [progressValue, setProgressValue] = useState(0);

  const status = useMemo<Status>(() => {
    if (isLoading) {
      return "loading";
    }
    if (error) {
      return "error";
    }
    if (data) {
      return "completed";
    }
    return "pending";
  }, [isLoading, data, error]);

  useEffect(() => {
    let timer: number | undefined;

    if (status === "loading") {
      setProgressValue(0); // Reset to zero whenever loading starts

      timer = setInterval(() => {
        setProgressValue((prev) => {
          if (prev >= 100) {
            return 0; // loop back to zero after reaching 100
          }
          // Use a small increment for smooth animation
          return prev + 1;
        });
      }, 30); // 30ms per tick, about 3 seconds to 100
    } else {
      // If status changes (e.g., to completed or error), set to full or clear
      if (status === "completed") {
        setProgressValue(100);
      } else {
        setProgressValue(0);
      }
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [setProgressValue, status]);

  if (!showPending && stepEvents.length === 0) {
    return null;
  }

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.5}
        disabled={!(status === "completed" && typeof renderData === "function")}
        onPress={() => {
          setShowModal(true);
        }}
        className="w-full"
      >
        <Card variant="elevated" className="w-full">
          <VStack space="sm" className="w-full">
            <HStack className="justify-between items-start">
              <HStack space="md" className="items-start">
                <StatusIcon status={status} />
                <VStack>
                  <Text size="md" className="font-bold">
                    {title}
                  </Text>
                  {typeof renderDescription === "function" && (
                    <Text size="sm" className="text-typography-500 ">
                      {renderDescription(status)}
                    </Text>
                  )}
                </VStack>
              </HStack>
              <StatusBadge status={status} />
            </HStack>
            {status === "loading" && (
              <Box className="mt-3">
                <Progress value={progressValue} className="w-full" size="xs">
                  <ProgressFilledTrack className="bg-blue-500" />
                </Progress>
              </Box>
            )}
          </VStack>
        </Card>
      </TouchableOpacity>
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        size="lg"
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="lg">Details</Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <>{renderData?.(data as any)}</>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProgressEventStep;
