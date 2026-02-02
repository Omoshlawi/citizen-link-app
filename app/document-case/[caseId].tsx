import { CaseDocumentImages } from "@/components/cases";
import { ScreenLayout } from "@/components/layout";
import { DisplayTile, DisplayTile3 } from "@/components/list-tile";
import { ErrorState, When } from "@/components/state-full-widgets";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useDocumentCase } from "@/hooks/use-document-cases";
import { authClient } from "@/lib/auth-client";
import { Address } from "@/types/address";
import {
  DocumentCase,
  Document as DocumentType,
  FoundDocumentCaseStatus,
  LostDocumentCaseStatus,
} from "@/types/cases";
import dayjs from "dayjs";
import { useLocalSearchParams } from "expo-router";
import { Building, Calendar, Info, MapPin } from "lucide-react-native";
import React from "react";
import { ScrollView } from "react-native";

const DocumentCaseDetailScreen = () => {
  const { caseId } = useLocalSearchParams<{ caseId: string }>();
  const { report, error, isLoading } = useDocumentCase(caseId as string);
  const { data: userSession } = authClient.useSession();
  return (
    <ScreenLayout title="Case Details">
      <When
        asyncState={{ isLoading, error, data: report }}
        error={(e) => <ErrorState error={e} />}
        loading={() => <Spinner />}
        success={(docCase?: DocumentCase) => {
          if (!docCase) return <></>;
          const document: Partial<DocumentType> = docCase.document ?? {};
          const ownerName = document.ownerName ?? "—";
          const documentNumber = document.documentNumber ?? "—";
          const documentType = document.type?.name ?? "Document";
          const images = document.images ?? [];
          const address: Address | undefined = docCase.address;
          const { eventDate, id: caseIdFromData } = docCase;
          const additionalFields = document.additionalFields ?? [];
          const status =
            docCase.foundDocumentCase?.status ??
            docCase.lostDocumentCase?.status ??
            FoundDocumentCaseStatus.DRAFT;

          const isSuccessStatus =
            status === FoundDocumentCaseStatus.COMPLETED ||
            status === FoundDocumentCaseStatus.VERIFIED ||
            status === LostDocumentCaseStatus.COMPLETED;
          const isDraft = status === FoundDocumentCaseStatus.DRAFT;
          const dateFomart = "DD MMMM YYYY";

          return (
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ paddingBottom: 32 }}
              showsVerticalScrollIndicator={false}
            >
              {/* Hero: document image + owner */}
              <HStack className="items-center justify-between">
                <Text className="text-typography-500 text-sm">
                  Case #{caseIdFromData?.slice(-6) || caseId}
                </Text>
                <Box
                  className={`px-2.5 py-1 rounded-md ${
                    isDraft
                      ? "bg-amber-100"
                      : isSuccessStatus
                      ? "bg-emerald-100"
                      : "bg-outline-100"
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold uppercase tracking-wide ${
                      isDraft
                        ? "text-amber-800"
                        : isSuccessStatus
                        ? "text-emerald-800"
                        : "text-typography-600"
                    }`}
                  >
                    {status}
                  </Text>
                </Box>
              </HStack>

              <CaseDocumentImages images={images} documentType={documentType} />

              <VStack space="xs" className="items-center pt-5">
                <Heading size="xl" className="text-typography-900">
                  {ownerName}
                </Heading>
                <Text className="text-typography-600 text-base">
                  ID {documentNumber}
                </Text>
              </VStack>

              {/* Details section */}
              <VStack className=" pt-6" space="md">
                <Text className="text-sm font-semibold text-typography-800">
                  Details
                </Text>
                <Box className="rounded-xl bg-background-0 dark:bg-background-btn border border-outline-100 overflow-hidden">
                  <VStack className="px-4" space="xs">
                    <DisplayTile
                      icon={Building}
                      label="Institution"
                      value={document.issuer}
                      withBottomOutline
                    />
                    <DisplayTile
                      icon={Calendar}
                      label="Date of birth"
                      value={
                        dayjs(document.dateOfBirth).isValid()
                          ? dayjs(document.dateOfBirth).format(dateFomart)
                          : undefined
                      }
                      hideIfNoValue
                      withBottomOutline
                    />
                    <DisplayTile
                      icon={Calendar}
                      label={docCase.lostDocumentCase ? "Lost" : "Found"}
                      value={dayjs(eventDate).format(dateFomart)}
                    />
                    {additionalFields.map((f, i) => (
                      <DisplayTile
                        withTopOutline
                        key={i}
                        icon={Info}
                        label={f.fieldName}
                        value={f.fieldValue}
                      />
                    ))}
                  </VStack>
                </Box>

                {/* Address */}
                {address?.address1 && (
                  <DisplayTile3
                    icon={MapPin}
                    label={address.label as string}
                    value1="Location"
                    value2={`${address.address1} ${
                      address.address2 ? ", " + address.address2 : ""
                    }`}
                    value3={`${address.landmark}\n${[
                      address.level4,
                      address.level3,
                      address.level2,
                      address.level1,
                    ]
                      .filter(Boolean)
                      .join(", ")} ${
                      address.country ? ` · ${address.country}` : ""
                    }`}
                  />
                )}

                {/* Actions */}
                <VStack space="sm" className="pt-2">
                  <Button
                    size="lg"
                    action="primary"
                    className="rounded-full bg-background-btn"
                    onPress={() => {}}
                  >
                    <ButtonText className="font-semibold">
                      Claim this document
                    </ButtonText>
                  </Button>
                  <Button
                    size="lg"
                    variant="solid"
                    action="secondary"
                    className="rounded-full bg-white "
                    onPress={() => {}}
                  >
                    <ButtonText className="text-typography-link">
                      Contact support
                    </ButtonText>
                  </Button>
                </VStack>

                <Text className="text-center text-typography-400 text-xs pt-4">
                  Created {dayjs(docCase!.createdAt).format(dateFomart)}
                </Text>
              </VStack>
            </ScrollView>
          );
        }}
      />
    </ScreenLayout>
  );
};

export default DocumentCaseDetailScreen;
