import { useFollowUps } from "@/hooks/useFollowUp";
import {
  getPriorityDisplay,
  getReferralStatusColor,
  getRiskInterpretation,
  getStatusFromDates,
} from "@/lib/helpers";
import { Referral } from "@/types/screening";
import Color from "color";
import dayjs from "dayjs";
import { router } from "expo-router";
import { ArrowRightLeft } from "lucide-react-native";
import React, { FC } from "react";
import ListTile from "../list-tile";
import { ErrorState } from "../state-full-widgets";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { Icon } from "../ui/icon";
import { Spinner } from "../ui/spinner";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

type ReferralFollowUpsProps = {
  referral: Referral;
};

const ReferralFollowUps: FC<ReferralFollowUpsProps> = ({ referral }) => {
  const { isLoading, error, followUps } = useFollowUps({
    referralId: referral.id,
  });

  if (isLoading) {
    return <Spinner color="primary" />;
  }
  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <Card
      size="lg"
      variant="elevated"
      className="gap-3 bg-background-0 rounded-none"
    >
      <VStack space="sm">
        <Heading size="sm" className="text-typography-500">
          Referral followups history
        </Heading>
        {followUps.length > 0 ? (
          <VStack space="xs" className="bg-background-50 p-2 rounded-md">
            {followUps.map((followUp) => (
              <ListTile
                key={followUp.id}
                title={
                  dayjs(followUp.startDate).format("DD/MM/YYYY") +
                  " - " +
                  dayjs(followUp.dueDate).format("DD/MM/YYYY")
                }
                description={`Priority: ${getPriorityDisplay(
                  followUp.priority
                )} | ${getRiskInterpretation(
                  followUp.triggerScreening.scoringResult?.interpretation
                )}(${followUp.triggerScreening.scoringResult?.aggregateScore})`}
                leading={
                  <Icon
                    as={ArrowRightLeft}
                    size="xs"
                    className="text-typography-500"
                  />
                }
                trailing={
                  <Text
                    size="2xs"
                    className={`px-2 py-1 rounded-md`}
                    style={{
                      color: getReferralStatusColor(
                        getStatusFromDates(
                          followUp.completedAt,
                          followUp.canceledAt
                        )
                      ),
                      backgroundColor: Color(
                        getReferralStatusColor(
                          getStatusFromDates(
                            followUp.completedAt,
                            followUp.canceledAt
                          )
                        )
                      )
                        .alpha(0.1)
                        .toString(),
                    }}
                  >
                    {followUp.completedAt
                      ? "Completed"
                      : followUp.canceledAt
                      ? "Cancelled"
                      : "Ongoing"}
                  </Text>
                }
                onPress={() =>
                  router.push({
                    pathname: "/follow-up/[id]",
                    params: { id: followUp.id },
                  })
                }
              />
            ))}
          </VStack>
        ) : (
          <Text size="xs" className="text-typography-500">
            No Followups for this referral
          </Text>
        )}
      </VStack>
    </Card>
  );
};

export default ReferralFollowUps;
