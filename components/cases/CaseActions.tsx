import {
  CaseType,
  DocumentCase,
  FoundDocumentCaseStatus,
  LostDocumentCaseStatus,
} from "@/types/cases";
import dayjs from "dayjs";
import { router } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import React, { FC, useMemo } from "react";
import { Button, ButtonIcon, ButtonText } from "../ui/button";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

type CaseActionsProps = {
  documentCase: DocumentCase;
};
const CaseActions: FC<CaseActionsProps> = ({ documentCase: docCase }) => {
  const dateFomart = "DD MMMM YYYY";
  const casetype: CaseType = docCase.foundDocumentCase ? "FOUND" : "LOST";
  const foundCase = docCase.foundDocumentCase;
  const lostCase = docCase.lostDocumentCase;
  const canEdit = useMemo(() => {
    if (
      casetype === "FOUND" &&
      foundCase?.status === FoundDocumentCaseStatus.DRAFT
    ) {
      return true;
    }
    if (
      casetype === "LOST" &&
      lostCase?.status !== LostDocumentCaseStatus.COMPLETED
    ) {
      return true;
    }

    return false;
  }, [casetype, lostCase, foundCase]);
  return (
    <VStack space="sm" className="pt-4">
      {canEdit && (
        <Button
          size="lg"
          variant="solid"
          action="secondary"
          className="rounded-full bg-gray-400 "
          onPress={() => {
            router.push({
              pathname: "/document-case/[caseId]/edit",
              params: { caseId: docCase.id },
            });
          }}
        >
          <ButtonText className="text-white">Edit Document</ButtonText>
          <ButtonIcon as={ArrowRight} className="text-white" />
        </Button>
      )}
      {casetype === "FOUND" &&
        foundCase?.status === FoundDocumentCaseStatus.DRAFT && (
          <Button
            size="lg"
            action="primary"
            className="rounded-full bg-background-btn"
            onPress={() => {}}
          >
            <ButtonText className="font-semibold text-white">
              Submit for verification
            </ButtonText>
            <ButtonIcon as={ArrowRight} className="text-white" />
          </Button>
        )}

      <Text className="text-center text-typography-400 text-xs pt-4">
        Created {dayjs(docCase!.createdAt).format(dateFomart)}
      </Text>
    </VStack>
  );
};

export default CaseActions;
