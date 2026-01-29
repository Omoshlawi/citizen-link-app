import { ScreenLayout } from "@/components/layout";
import ListTile from "@/components/list-tile";
import { EmptyState, ErrorState, When } from "@/components/state-full-widgets";
import { Box } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { useActivities } from "@/hooks/useActivities";
import { getRiskInterpretation } from "@/lib/helpers";
import { RiskInterpretation } from "@/types/screening";
import dayjs from "dayjs";
import { Dot } from "lucide-react-native";
import React from "react";
import { FlatList } from "react-native";

import Pagination from "@/components/Pagination";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const ActivitiesScreen = () => {
  const { activities, error, isLoading, ...pagination } = useActivities({});

  return (
    <ScreenLayout title="Activities">
      <When
        asyncState={{ isLoading, error, data: activities }}
        loading={() => <Spinner />}
        error={(e) => <ErrorState error={e} />}
        success={(activities) => {
          if (!activities?.length)
            return <EmptyState message="No activities" />;
          return (
            <Box className="flex-1 mt-2">
              <FlatList
                data={activities ?? []}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => <Box className="h-2 " />}
                renderItem={({ item: activity }) => (
                  <ListTile
                    className="bg-background-0 p-4"
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
                        : ""
                    }
                    trailing={
                      <Text size="xs" className="text-typography-500">
                        {dayjs(activity.createdAt).fromNow()}
                      </Text>
                    }
                  />
                )}
              />
              <Pagination {...pagination} isLoading={isLoading} />
            </Box>
          );
        }}
      />
    </ScreenLayout>
  );
};

export default ActivitiesScreen;
