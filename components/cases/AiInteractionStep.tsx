import { cleanAiResponseText } from "@/lib/helpers";
import { AiInteraction } from "@/types/cases";
import React, { useMemo, useState } from "react";
import SegmentedControl from "../SegmentedControl";
import { Badge, BadgeText } from "../ui/badge";
import { Box } from "../ui/box";
import { Card } from "../ui/card";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

type AiInteractionStepProps<T extends object> = {
  aiInteraction: AiInteraction;
  renderParsedResponse?: (response: T) => React.ReactNode;
};

const AiInteractionStep = <T extends object>({
  aiInteraction: aiData,
  renderParsedResponse,
}: AiInteractionStepProps<T>) => {
  const tabs = useMemo(
    () => [
      {
        label: "Data",
        value: "data",
        visible: typeof renderParsedResponse === "function",
      },
      { label: "JSON", value: "json", visible: true },
      { label: "AI", value: "ai", visible: true },
    ],
    [renderParsedResponse]
  );
  const [activeTab, setActiveTab] = useState(
    typeof renderParsedResponse === "function" ? "data" : "json"
  );
  return (
    <Box>
      <SegmentedControl
        data={tabs.filter((t) => t.visible)}
        value={activeTab}
        onChange={setActiveTab}
      />

      {typeof renderParsedResponse === "function" && activeTab === "data" && (
        <>
          {renderParsedResponse(
            JSON.parse(cleanAiResponseText(aiData.response))
          )}
        </>
      )}

      {activeTab === "json" && (
        <Text style={{ fontFamily: "monospace" }}>
          {JSON.stringify(
            JSON.parse(cleanAiResponseText(aiData.response)),
            null,
            2
          )}
        </Text>
      )}

      {activeTab === "ai" && (
        <Card className="p-2 mt-2">
          <Text size="sm" className="mb-2">
            AI Interaction Details:
          </Text>

          <HStack space="xs">
            <Text
              size="sm"
              style={{ minWidth: 140 }}
              className="text-typography-500"
            >
              Model:
            </Text>
            <Text size="sm" className="font-bold">
              {aiData.aiModel} ({aiData.modelVersion})
            </Text>
          </HStack>

          <HStack space="xs">
            <Text
              size="sm"
              className="text-typography-500"
              style={{ minWidth: 140 }}
            >
              Interaction Type:
            </Text>
            <Text size="sm" className="font-bold">
              {aiData.interactionType}
            </Text>
          </HStack>

          {aiData.tokenUsage && (
            <Box className="mt-2">
              <Text size="sm" className="text-typography-500 mb-2">
                Token Usage:
              </Text>
              <VStack space="sm">
                <HStack space="xs">
                  <Text
                    size="sm"
                    className="text-typography-500"
                    style={{ minWidth: 140 }}
                  >
                    Total Tokens:
                  </Text>
                  <Text size="sm" className={"font-bold"}>
                    {aiData.tokenUsage.totalTokenCount.toLocaleString()}
                  </Text>
                </HStack>
                <HStack space="xs">
                  <Text
                    size="sm"
                    className="text-typography-500"
                    style={{ minWidth: 140 }}
                  >
                    Prompt Tokens:
                  </Text>
                  <Text size="sm" className={"font-bold"}>
                    {aiData.tokenUsage.promptTokenCount.toLocaleString()}
                  </Text>
                </HStack>
                <HStack space="xs">
                  <Text
                    size="sm"
                    className="text-typography-500"
                    style={{ minWidth: 140 }}
                  >
                    Response Tokens:
                  </Text>
                  <Text size="sm" className={"font-bold"}>
                    {aiData.tokenUsage.candidatesTokenCount.toLocaleString()}
                  </Text>
                </HStack>
              </VStack>
            </Box>
          )}

          {aiData.processingTime && (
            <HStack space="xs">
              <Text
                size="sm"
                className="text-typography-500"
                style={{ minWidth: 140 }}
              >
                Processing Time:
              </Text>
              <Text size="sm" className={"font-bold"}>
                {aiData.processingTime}
              </Text>
            </HStack>
          )}

          {aiData.estimatedCost && (
            <HStack space="xs">
              <Text
                size="sm"
                className="text-typography-500"
                style={{ minWidth: 140 }}
              >
                Estimated Cost:
              </Text>
              <Text size="sm">{aiData.estimatedCost}</Text>
            </HStack>
          )}

          <HStack space="xs">
            <Text
              size="sm"
              className="text-typography-500"
              style={{ minWidth: 140 }}
            >
              Status:
            </Text>
            <Badge
              className={aiData.success ? "bg-green-600" : "bg-red-500"}
              variant="solid"
            >
              <BadgeText>{aiData.success ? "Success" : "Failed"}</BadgeText>
            </Badge>
          </HStack>

          {aiData.errorMessage && (
            <Box className="mt-2">
              <Text size="sm" className="text-typography-500">
                Error Message:
              </Text>
              <Text size="sm" className="text-red-500">
                {aiData.errorMessage}
              </Text>
            </Box>
          )}

          {aiData.retryCount > 0 && (
            <HStack space="xs">
              <Text
                size="sm"
                className="text-typography-500"
                style={{ minWidth: 140 }}
              >
                Retry Count:
              </Text>
              <Text size="sm">{aiData.retryCount}</Text>
            </HStack>
          )}
        </Card>
      )}
    </Box>
  );
};

export default AiInteractionStep;
