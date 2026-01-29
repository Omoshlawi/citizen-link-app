import { ScreeningResults } from "@/components/client/screening-form";
import ScreenLayout from "@/components/layout/ScreenLayout";
import { ErrorState, When } from "@/components/state-full-widgets";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";
import { useScreening } from "@/hooks/useScreenings";
import { useLocalSearchParams } from "expo-router";
import React from "react";

const ScreeningDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { screening, isLoading, error } = useScreening(id);
  return (
    <ScreenLayout title="Screening Detail">
      <When
        asyncState={{ isLoading, error, data: screening }}
        error={(e) => <ErrorState error={e} />}
        loading={() => <Spinner color="primary" />}
        success={(screening) => (
          <Card
            size="lg"
            variant="elevated"
            className="gap-3 bg-background-0 flex-1"
          >
            <VStack space="md">
              <Heading size="md" className="text-typography-500">
                {`${screening?.client?.firstName} ${screening?.client?.lastName}`}{" "}
                Screening Results
              </Heading>
              <ScreeningResults screening={screening!} />
            </VStack>
          </Card>
        )}
      />
    </ScreenLayout>
  );
};

export default ScreeningDetail;
