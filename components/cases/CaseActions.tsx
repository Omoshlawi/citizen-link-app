import { useDocumentCaseApi } from "@/hooks/use-document-cases";
import { handleApiErrors } from "@/lib/api";
import {
  CaseType,
  DocumentCase,
  FoundDocumentCaseStatus,
  LostDocumentCaseStatus,
} from "@/types/cases";
import cn from "classnames";
import { router } from "expo-router";
import {
  ArrowRight,
  Edit,
  FolderTree,
  MoreVertical,
} from "lucide-react-native";
import React, { FC, useMemo } from "react";
import Toaster from "../toaster";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
} from "../ui/actionsheet";
import { Button, ButtonIcon, ButtonSpinner, ButtonText } from "../ui/button";
import { Heading } from "../ui/heading";
import { Icon } from "../ui/icon";
import { Menu, MenuItem, MenuItemLabel, MenuSeparator } from "../ui/menu";
import { Spinner } from "../ui/spinner";
import { Text } from "../ui/text";
import { useToast } from "../ui/toast";
import { VStack } from "../ui/vstack";

type CaseActionsProps = {
  documentCase: DocumentCase;
};
const CaseActions: FC<CaseActionsProps> = ({ documentCase: docCase }) => {
  const { submitFoundDocumentCase, submitLostDocumentCase } =
    useDocumentCaseApi();

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
      if (casetype === "FOUND") {
        await submitFoundDocumentCase(docCase.foundDocumentCase!.id);
      } else {
        await submitLostDocumentCase(docCase.lostDocumentCase!.id);
      }
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
  const disabled =
    (foundCase?.status !== FoundDocumentCaseStatus.DRAFT &&
      lostCase?.status !== LostDocumentCaseStatus.DRAFT) ||
    submitting;

  return (
    <>
      <Menu
        placement="top"
        offset={5}
        disabledKeys={["Settings"]}
        trigger={({ ...triggerProps }) => {
          return (
            <Button
              {...triggerProps}
              size="lg"
              className="rounded-full p-3.5"
              variant="link"
            >
              <ButtonIcon as={MoreVertical} />
            </Button>
          );
        }}
      >
        <MenuItem disabled textValue="Actions">
          <MenuItemLabel className="font-bold">Actions</MenuItemLabel>
        </MenuItem>
        <MenuSeparator />

        <MenuItem
          key="Review & Edit Document details"
          textValue="Review & Edit Document details"
          disabled={disabled}
          onPress={() => {
            router.push({
              pathname: "/document-case/[caseId]/edit",
              params: { caseId: docCase.id },
            });
          }}
        >
          <Icon
            as={Edit}
            size="sm"
            className={cn("mr-2 text-blue-500 ", {
              "text-gray-400": disabled,
            })}
          />
          <MenuItemLabel
            size="sm"
            className={cn("text-blue-500", {
              "text-gray-400": disabled,
            })}
          >
            Review & Edit Document details
          </MenuItemLabel>
        </MenuItem>

        <MenuItem
          key="Submit for verification"
          textValue="Submit for verification"
          disabled={disabled}
          onPress={() => {
            setShowActionsheet(true);
          }}
        >
          {submitting ? (
            <Spinner />
          ) : (
            <Icon
              as={ArrowRight}
              size="sm"
              className={cn("mr-2 text-teal-500", {
                "text-gray-400": disabled,
              })}
            />
          )}
          <MenuItemLabel
            size="sm"
            className={cn("text-teal-500", {
              "text-gray-400": disabled,
            })}
          >
            Submit for verification
          </MenuItemLabel>
        </MenuItem>

        <MenuItem
          key="View document matches"
          textValue="View document matches"
          disabled={!canViewMatches}
          onPress={() => {
            router.push({
              pathname: "/document-case/[caseId]/matches",
              params: { caseId: docCase.id },
            });
          }}
        >
          <Icon
            as={FolderTree}
            size="sm"
            className={cn("mr-2 text-orange-500", {
              "text-gray-400": !canViewMatches,
            })}
          />
          <MenuItemLabel
            size="sm"
            className={cn("text-orange-500", {
              "text-gray-400": !canViewMatches,
            })}
          >
            View document matches
          </MenuItemLabel>
        </MenuItem>
      </Menu>
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
              By continuing, you confirm that the details you have entered are
              accurate.
              <Text className="font-semibold">
                After submitting, you will not be able to edit the document
                details.
              </Text>
              <Text>{"\n\n"}</Text>
              {casetype === "FOUND" && (
                <Text>
                  To verify this document, please either:{"\n"}- Drop the
                  document at the nearest station for official verification, or
                  {"\n"}- Request retrieval so a Citizen Link agent can come and
                  collect it from you.
                </Text>
              )}
            </Text>
            <Button
              onPress={handleAcceptAndContinue}
              className="bg-background-btn rounded-full justify-between"
              disabled={submitting}
            >
              {submitting && <ButtonSpinner className="text-white" />}
              <ButtonText className="text-white">Confirm and submit</ButtonText>
              <ButtonIcon as={ArrowRight} className="text-white" />
            </Button>
          </VStack>
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
};

export default CaseActions;
