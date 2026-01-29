import { useActivities } from "@/hooks/useActivities";
import {
  getFollowUpCategoryDisply,
  getPriorityDisplay,
  getRiskInterpretation,
} from "@/lib/helpers";
import { RiskInterpretation } from "@/types/screening";
import dayjs from "dayjs";
import { router } from "expo-router";
import { Clipboard, Dot } from "lucide-react-native";
import React from "react";
import ListTile from "../list-tile";
import { ErrorState, When } from "../state-full-widgets";
import { Box } from "../ui/box";
import { Button, ButtonText } from "../ui/button";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
import { Spinner } from "../ui/spinner";
import { Text } from "../ui/text";

import relativeTime from "dayjs/plugin/relativeTime";
import { Center } from "../ui/center";
dayjs.extend(relativeTime);

const RecentActivity = () => {
  const { activities, error, isLoading } = useActivities({
    limit: "5",
  });

  return (
    <Box className="mt-4">
      <HStack className="justify-between items-center">
        <Heading size="xs">Recent Activity</Heading>
        <Button
          variant="link"
          size="sm"
          onPress={() => router.push("/activities")}
        >
          <ButtonText className="text-teal-600">View All</ButtonText>
        </Button>
      </HStack>
      <When
        asyncState={{ isLoading, error, data: activities }}
        loading={() => <Spinner />}
        error={(e) => <ErrorState error={e} />}
        success={(activities) => {
          if (!activities?.length)
            return (
              <Card className="bg-background-0 flex-col gap-2 mt-2">
                <Center>
                  <Icon as={Clipboard} size="xl" className="mb-2" />
                  <Text className="text-typography-500" size="sm">
                    No activities
                  </Text>
                </Center>
              </Card>
            );

          return (
            <Card className="bg-background-0 flex-col gap-2 mt-2">
              {activities?.map((activity) => (
                <ListTile
                  key={activity.id}
                  leading={
                    <Icon
                      as={Dot}
                      className={
                        activity.resource === "screening"
                          ? activity.metadata?.riskInterpretation ===
                            RiskInterpretation.LOW_RISK
                            ? "text-teal-600"
                            : activity.metadata?.riskInterpretation ===
                              RiskInterpretation.MEDIUM_RISK
                            ? "text-yellow-600"
                            : "text-red-600"
                          : "text-primary-600"
                      }
                      size="xl"
                    />
                  }
                  title={`${activity.action} ${activity.resource} - ${activity.metadata?.clientName}`}
                  description={
                    activity.resource === "screening"
                      ? `Score: ${
                          activity.metadata?.riskScore ?? "N/A"
                        } | ${getRiskInterpretation(
                          activity.metadata?.riskInterpretation
                        )}`
                      : activity.resource === "referral"
                      ? `Referral to ${activity.metadata?.healthFacilityName}`
                      : activity.resource === "client"
                      ? `Client: ${activity.metadata?.clientName}`
                      : activity.resource === "followUp"
                      ? `${getFollowUpCategoryDisply(
                          activity.metadata?.category
                        )}(${getPriorityDisplay(activity.metadata?.priority)})`
                      : ""
                  }
                  trailing={
                    <Text size="xs" className="text-typography-500">
                      {dayjs(activity.createdAt).fromNow()}
                    </Text>
                  }
                />
              ))}
            </Card>
          );
        }}
      />
    </Box>
  );
};

export default RecentActivity;
