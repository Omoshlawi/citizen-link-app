import {
    CaseActions,
    CaseDocumentImages,
    DocumentDetails,
  } from "@/components/cases";
  import { ScreenLayout } from "@/components/layout";
  import { DisplayTile, DisplayTile3 } from "@/components/list-tile";
  import { ErrorState, When } from "@/components/state-full-widgets";
  import { Badge, BadgeText } from "@/components/ui/badge";
  import { Box } from "@/components/ui/box";
  import { Heading } from "@/components/ui/heading";
  import { HStack } from "@/components/ui/hstack";
  import { Spinner } from "@/components/ui/spinner";
  import { Text } from "@/components/ui/text";
  import { VStack } from "@/components/ui/vstack";
  import { useDocumentCase } from "@/hooks/use-document-cases";
  import { Address } from "@/types/address";
  import {
    DocumentCase,
    Document as DocumentType,
    FoundDocumentCaseStatus,
    LostDocumentCaseStatus,
  } from "@/types/cases";
  import dayjs from "dayjs";
  import { useLocalSearchParams } from "expo-router";
  import { Briefcase, Calendar, MapPin } from "lucide-react-native";
  import React from "react";
  import { ScrollView } from "react-native";
  
  const DocumentCaseDetailScreen = () => {
    const { caseId } = useLocalSearchParams<{ caseId: string }>();
    const { report, error, isLoading } = useDocumentCase(caseId as string);
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
                <HStack className="items-center justify-between mb-4">
                  <Text className="text-typography-500 text-sm">
                    Case #{caseIdFromData?.slice(-6) || caseId}
                  </Text>
                  <HStack space="sm">
                    <Badge
                      size="sm"
                      className={
                        docCase?.foundDocumentCase
                          ? "bg-green-500 rounded-full"
                          : "bg-red-500 rounded-full"
                      }
                    >
                      <BadgeText className="text-white">
                        {docCase?.foundDocumentCase
                          ? "Found Document"
                          : "Lost Document"}
                      </BadgeText>
                    </Badge>
                    <Badge
                      size="sm"
                      className={
                        isDraft
                          ? "bg-amber-500 rounded-full"
                          : isSuccessStatus
                          ? "bg-emerald-500 rounded-full"
                          : "bg-outline-500 rounded-full"
                      }
                    >
                      <BadgeText className={"text-white"}>{status}</BadgeText>
                    </Badge>
                  </HStack>
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
                <VStack className="pt-6" space="md">
                  <Text className="text-sm font-semibold text-typography-800">
                    Case Details
                  </Text>
                  <Box className="rounded-xl bg-background-0 dark:bg-background-btn border border-outline-100 overflow-hidden">
                    <VStack className="px-4" space="xs">
                      <DisplayTile
                        icon={Briefcase}
                        label={"Case Type"}
                        value={
                          docCase.lostDocumentCase ? "Lost case" : "Found Case"
                        }
                      />
                      <DisplayTile
                        icon={Calendar}
                        label={docCase.lostDocumentCase ? "Lost" : "Found"}
                        value={dayjs(eventDate).format(dateFomart)}
                        withTopOutline
                      />
                      <DisplayTile
                        icon={Calendar}
                        label={"Tags"}
                        value={
                          docCase.tags.length > 0
                            ? docCase.tags.join(", ")
                            : undefined
                        }
                        hideIfNoValue
                        withTopOutline
                      />
                    </VStack>
                  </Box>
                </VStack>
  
                {/* Document details Field Section */}
                <DocumentDetails document={document as any} />
  
                {/* Address section */}
                {address?.address1 && (
                  <Box className="pt-6">
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
                  </Box>
                )}
  
                {/* Actions */}
                <CaseActions documentCase={docCase} />
              </ScrollView>
            );
          }}
        />
      </ScreenLayout>
    );
  };
  
  export default DocumentCaseDetailScreen;
  