import { ProtectedImages } from "@/components/image";
import { ScreenLayout } from "@/components/layout";
import { DisplayTile } from "@/components/list-tile";
import { ClaimActions } from "@/components/matches";
import { EmptyState, ErrorState, When } from "@/components/state-full-widgets";
import { Box } from "@/components/ui/box";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useClaim } from "@/hooks/use-claims";
import { getClaimStatusDisplay } from "@/lib/helpers";
import { ClaimStatus } from "@/types/claim";
import cn from "classnames";
import dayjs from "dayjs";
import { useLocalSearchParams } from "expo-router";
import { Hash, Info } from "lucide-react-native";
import React from "react";
import { ScrollView } from "react-native";
const DocumentClaimDetail = () => {
  const { claimId } = useLocalSearchParams<{ claimId: string }>();
  const { error, isLoading, claim } = useClaim(claimId);

  return (
    <ScreenLayout
      title="Document Claim"
      actions={
        claim && <ClaimActions matchId={claim.matchId} claimId={claim.id} />
      }
    >
      <When
        asyncState={{ isLoading, error, data: claim }}
        loading={() => <Spinner />}
        error={(e) => <ErrorState error={e} />}
        success={(data) => {
          if (!data) return <EmptyState message="Claim not found" />;
          return (
            <ScrollView showsVerticalScrollIndicator={false}>
              <VStack>
                <VStack space="md">
                  <VStack className=" pt-6" space="md">
                    <Text className="text-sm font-semibold text-typography-800">
                      Support documents(attachments)
                    </Text>
                    <Box className="rounded-xl bg-background-0 dark:bg-background-btn border border-outline-100 overflow-hidden">
                      <VStack className="px-4" space="xs">
                        <ProtectedImages
                          images={data.attachments.map((at) => at.storageKey)}
                        />
                      </VStack>
                    </Box>
                  </VStack>
                  <VStack className=" pt-6" space="md">
                    <Text className="text-sm font-semibold text-typography-800">
                      Claim details
                    </Text>
                    <Box className="rounded-xl bg-background-0 dark:bg-background-btn border border-outline-100 overflow-hidden">
                      <VStack className="px-4" space="xs">
                        <DisplayTile
                          icon={Hash}
                          label={"Claim number"}
                          value={data.claimNumber}
                          withBottomOutline
                        />

                        <DisplayTile
                          icon={Info}
                          label={"Status"}
                          value={getClaimStatusDisplay(data.status)}
                          withBottomOutline
                          trailing={
                            <Text
                              className={cn(
                                `px-2 py-1 rounded-full text-white`,
                                {
                                  "bg-teal-600":
                                    data.status === ClaimStatus.VERIFIED,
                                  "bg-red-600":
                                    data.status === ClaimStatus.REJECTED ||
                                    data.status === ClaimStatus.CANCELLED,
                                  "bg-blue-600":
                                    data.status === ClaimStatus.PENDING,
                                  "bg-yellow-600":
                                    data.status === ClaimStatus.DISPUTED,
                                },
                              )}
                              size="xs"
                            >
                              {getClaimStatusDisplay(data.status)}
                            </Text>
                          }
                        />
                        <DisplayTile
                          icon={Info}
                          label={"date claimed"}
                          value={dayjs(data.createdAt).format(
                            "ddd DD MMM, YYYY",
                          )}
                          withBottomOutline
                        />
                      </VStack>
                    </Box>
                  </VStack>
                  <VStack className=" pt-6" space="md">
                    <Text className="text-sm font-semibold text-typography-800">
                      My response
                    </Text>
                    <Box className="rounded-xl bg-background-0 dark:bg-background-btn border border-outline-100 overflow-hidden">
                      <VStack className="px-4" space="xs">
                        {claim?.verification?.userResponses?.map((res, i) => (
                          <DisplayTile
                            withTopOutline={i !== 0}
                            icon={Info}
                            label={res.question}
                            value={res.response}
                            key={i}
                          />
                        ))}
                      </VStack>
                    </Box>
                  </VStack>
                </VStack>
              </VStack>
            </ScrollView>
          );
        }}
      />
    </ScreenLayout>
  );
};

export default DocumentClaimDetail;
