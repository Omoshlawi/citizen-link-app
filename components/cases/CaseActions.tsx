import { useDocumentCaseApi } from "@/hooks/use-document-cases";
import { handleApiErrors } from "@/lib/api";
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
import Toaster from "../toaster";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
} from "../ui/actionsheet";
import { Button, ButtonIcon, ButtonSpinner, ButtonText } from "../ui/button";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";
import { useToast } from "../ui/toast";
import { VStack } from "../ui/vstack";

type CaseActionsProps = {
  documentCase: DocumentCase;
};
const CaseActions: FC<CaseActionsProps> = ({ documentCase: docCase }) => {
  const { submitDocumentCase } = useDocumentCaseApi();

  const dateFomart = "DD MMMM YYYY";
  const casetype: CaseType = docCase.foundDocumentCase ? "FOUND" : "LOST";
  const foundCase = docCase.foundDocumentCase;
  const lostCase = docCase.lostDocumentCase;
  const toast = useToast();
  const [showActionsheet, setShowActionsheet] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const canViewMatches = useMemo(() => {
    if (
      casetype === "FOUND" &&
      (
        [
          FoundDocumentCaseStatus.VERIFIED,
          FoundDocumentCaseStatus.COMPLETED,
        ] as FoundDocumentCaseStatus[]
      ).includes(foundCase!.status)
    ) {
      return true;
    }
    if (
      casetype === "LOST" &&
      lostCase!.status !== LostDocumentCaseStatus.DRAFT
    ) {
      return true;
    }

    return false;
  }, [casetype, foundCase, lostCase]);
  const handleAcceptAndContinue = async () => {
    setSubmitting(true);
    try {
      await submitDocumentCase(docCase.id);
      setShowActionsheet(false);
    } catch (error) {
      const e = handleApiErrors(error);
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toaster
            uniqueToastId={`toast-${id}`}
            variant="outline"
            title="Error submitting for review"
            description={e.detail}
            action="error"
          />
        ),
      });
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <VStack space="sm" className="pt-4">
      {(foundCase?.status === FoundDocumentCaseStatus.DRAFT ||
        lostCase?.status === LostDocumentCaseStatus.DRAFT) && (
        <>
          <Button
            size="lg"
            variant="solid"
            action="secondary"
            className="rounded-full bg-background-btn"
            onPress={() => {
              router.push({
                pathname: "/document-case/[caseId]/edit",
                params: { caseId: docCase.id },
              });
            }}
          >
            <ButtonText className="text-white">
              Review & Edit Document details
            </ButtonText>
            <ButtonIcon as={ArrowRight} className="text-white" />
          </Button>
          <Button
            size="lg"
            action="primary"
            className="rounded-full bg-teal-500"
            onPress={() => setShowActionsheet(true)}
            disabled={submitting}
          >
            {submitting && <ButtonSpinner className="text-white" />}
            <ButtonText className="font-semibold text-white">
              Submit for verification
            </ButtonText>
            <ButtonIcon as={ArrowRight} className="text-white" />
          </Button>
          <Actionsheet
            isOpen={showActionsheet}
            onClose={() => {
              // prevent closig intill submission is complete
              if (!submitting) {
                setShowActionsheet(false);
              }
            }}
          >
            <ActionsheetBackdrop />
            <ActionsheetContent>
              <VStack className="w-full" space="lg">
                <Heading className="text-center">Confirm</Heading>
                <Text className="text-start text-typography-400 px-2 pb-2">
                  By continuing, you confirm that the details you have entered
                  are accurate.
                  <Text className="font-semibold">
                    After submitting, you will not be able to edit the document
                    details.
                  </Text>
                  <Text>{"\n\n"}</Text>
                  {casetype === "FOUND" && (
                    <Text>
                      To verify this document, please either:{"\n"}- Drop the
                      document at the nearest station for official verification,
                      or
                      {"\n"}- Request retrieval so a Citizen Link agent can come
                      and collect it from you.
                    </Text>
                  )}
                </Text>
                <Button
                  onPress={handleAcceptAndContinue}
                  className="bg-background-btn rounded-full"
                  disabled={submitting}
                >
                  {submitting && <ButtonSpinner className="text-white" />}
                  <ButtonText className="text-white">
                    Confirm and submit
                  </ButtonText>
                  <ButtonIcon as={ArrowRight} className="text-white" />
                </Button>
              </VStack>
            </ActionsheetContent>
          </Actionsheet>
        </>
      )}

      {canViewMatches && (
        <Button
          className="rounded-full"
          onPress={() =>
            router.push({
              pathname: "/document-case/[caseId]/matches",
              params: { caseId: docCase.id },
            })
          }
        >
          <ButtonText>View document matches</ButtonText>
          <ButtonIcon as={ArrowRight} />
        </Button>
      )}

      <Text className="text-center text-typography-400 text-xs pt-4">
        Created {dayjs(docCase!.createdAt).format(dateFomart)}
      </Text>
    </VStack>
  );
};

export default CaseActions;
