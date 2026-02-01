import {
  AiInteractionProgressEvent,
  ImageValidationEvent,
  ProgressEvent,
} from "@/types/cases";
import { FC, useMemo } from "react";
import { Box } from "../ui/box";
import { Card } from "../ui/card";
import { HStack } from "../ui/hstack";
import { Progress } from "../ui/progress";
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
  showPending = false,
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

  if (!showPending && stepEvents.length === 0) {
    return null;
  }

  return (
    <Card>
      <VStack space="sm">
        <HStack className="justify-between items-start">
          <HStack space="md" className="items-start">
            <StatusIcon status={status} />
            <Box style={{ flex: 1 }}>
              <Text size="md" className="font-bold">
                {title}
              </Text>
              {typeof renderDescription === "function" && (
                <Text size="sm" className="text-typography-500 mt-4">
                  {renderDescription(status)}
                </Text>
              )}
            </Box>
          </HStack>
          <StatusBadge status={status} />
        </HStack>
        {status === "loading" && (
          <Box className="mt-3">
            <Progress value={50} size="sm" className="rounded-xl" />
          </Box>
        )}
        {status === "completed" && typeof renderData === "function" && (
          <>{renderData(data as any)}</>
        )}
      </VStack>
    </Card>
  );
};

export default ProgressEventStep;
