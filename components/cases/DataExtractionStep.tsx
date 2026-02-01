import { ConfidenceScore, Document, ImageAnalysisResult } from "@/types/cases";
import React, { FC, useMemo, useState } from "react";
import SegmentedControl from "../SegmentedControl";
import { Box } from "../ui/box";
import { Card } from "../ui/card";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

type DataExtractionStepProps = {
  document: Document;
};

export const DataExtractionStep: FC<DataExtractionStepProps> = ({
  document: parsedData,
}) => {
  return (
    <Card>
      <Text size="sm">Extracted Data:</Text>
      <VStack space="xs">
        <FieldValue label="Owner Name" value={parsedData?.ownerName} />
        <FieldValue
          label="Document Number"
          value={parsedData?.documentNumber}
        />
        <FieldValue label="Date of Birth" value={parsedData?.dateOfBirth} />
        <FieldValue label="Issuer" value={parsedData?.issuer} />
        <FieldValue label="Issuer" value={parsedData?.issuer} />
        {parsedData.additionalFields &&
          parsedData.additionalFields.length > 0 && (
            <Box className="mt-2">
              <Text size="sm" className="text-typography-500">
                Additional Fields:
              </Text>
              <VStack space={"sm"}>
                {parsedData.additionalFields.map((field: any, idx: number) => (
                  <FieldValue
                    label="Issuer"
                    value={parsedData?.issuer}
                    key={idx}
                  />
                ))}
              </VStack>
            </Box>
          )}
      </VStack>
    </Card>
  );
};

type DataExtractionConfidenceScoreProps = {
  confidenceScore: ConfidenceScore;
};
export const DataExtractionConfidenceScore: FC<
  DataExtractionConfidenceScoreProps
> = ({ confidenceScore }) => {
  return (
    <Card>
      <VStack>
        <FieldValue label="Owner name" value={confidenceScore?.ownerName} />
        <FieldValue
          label="Document Number"
          value={confidenceScore?.documentNumber}
        />
        <FieldValue
          label="Date of birth"
          value={confidenceScore?.dateOfBirth}
        />
        <FieldValue label="Issuer" value={confidenceScore?.issuer} />
        <FieldValue label="Expiry date" value={confidenceScore?.expiryDate} />
      </VStack>
    </Card>
  );
};

type ImageAnalysisProps = {
  analysis: ImageAnalysisResult[];
};

export const ImageAnalysis: FC<ImageAnalysisProps> = ({ analysis }) => {
  const tabs = useMemo(
    () =>
      analysis.map((a) => ({
        label: `Image ${a.index}`,
        value: `image-${a.index}`,
      })),
    [analysis]
  );
  const [activeTab, setActiveTab] = useState("image-0");
  return (
    <Card>
      <SegmentedControl data={tabs} value={activeTab} onChange={setActiveTab} />
      {analysis.map((a, i) => (
        <Card key={i}>
          <VStack>
            <FieldValue label="Focus" value={a?.focus} />
            <FieldValue label="Image type" value={a?.imageType} />
            <FieldValue label="Lighting" value={a?.lighting} />
            <FieldValue label="Lighting" value={a?.lighting} />
            <FieldValue label="Readability" value={a?.readability} />
            <FieldValue
              label="Has tampering"
              value={a?.tamperingDetected ? "Yes" : "No"}
            />
            <FieldValue
              label="Usable for extraction"
              value={a?.usableForExtraction ? "Yes" : "No"}
            />
            <FieldValue label="Warnings" value={a?.warnings.join(", ")} />
          </VStack>
        </Card>
      ))}
    </Card>
  );
};

const FieldValue: FC<{ label: string; value?: string | number }> = ({
  label,
  value,
}) => {
  if (!value) return null;
  return (
    <HStack space="xs">
      <Text size="sm" className="text-typography-500" style={{ minWidth: 120 }}>
        {label}:
      </Text>
      <Text size="sm">{value}</Text>
    </HStack>
  );
};
