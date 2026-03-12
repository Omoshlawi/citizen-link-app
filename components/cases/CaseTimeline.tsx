import { DocumentCase } from "@/types/cases";
import dayjs from "dayjs";
import { Calendar } from "lucide-react-native";
import React from "react";
import { Text } from "react-native";
import { DisplayTile } from "../list-tile";
import { Box } from "../ui/box";
import { VStack } from "../ui/vstack";

type CaseTimelineProps = {
  documentCase: DocumentCase;
};

const CaseTimeline: React.FC<CaseTimelineProps> = ({
  documentCase: docCase,
}) => {
  const dateFomart = "DD MMMM YYYY";

  return (
    <VStack className="pt-6" space="md">
      <Text className="text-sm font-semibold text-typography-800">
        Case Details
      </Text>
      <Box className="rounded-xl bg-background-0 dark:bg-background-btn border border-outline-100 overflow-hidden">
        <VStack className="px-4" space="xs">
          <DisplayTile
            icon={Calendar}
            label={docCase.lostDocumentCase ? "Date Lost" : "Date Found"}
            value={dayjs(docCase.eventDate).format(dateFomart)}
          />
          <DisplayTile
            icon={Calendar}
            label={"Date Reported"}
            value={dayjs(docCase.createdAt).format(dateFomart)}
            withTopOutline
          />
          <DisplayTile
            icon={Calendar}
            label={"Date Submitted"}
            value={dayjs(docCase.createdAt).format(dateFomart)}
            withTopOutline
          />
          <DisplayTile
            icon={Calendar}
            label={"Date Approved"}
            value={dayjs(docCase.createdAt).format(dateFomart)}
            withTopOutline
          />
          <DisplayTile
            icon={Calendar}
            label={"Date Matched"}
            value={dayjs(docCase.createdAt).format(dateFomart)}
            withTopOutline
          />
          <DisplayTile
            icon={Calendar}
            label={"Date Claimed"}
            value={dayjs(docCase.createdAt).format(dateFomart)}
            withTopOutline
          />
          <DisplayTile
            icon={Calendar}
            label={"Date Claime Approved"}
            value={dayjs(docCase.createdAt).format(dateFomart)}
            withTopOutline
          />
          <DisplayTile
            icon={Calendar}
            label={"Date Handed Over"}
            value={dayjs(docCase.createdAt).format(dateFomart)}
            withTopOutline
          />
        </VStack>
      </Box>
    </VStack>
  );
};

export default CaseTimeline;
