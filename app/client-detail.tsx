import {
  ClientInfo,
  RiskTratification,
  ScreeningHistory,
} from "@/components/client";
import FollowUpHistory from "@/components/client/FollowUpHistory";
import ReferralHistory from "@/components/client/ReferralHistory";
import { ScreenLayout } from "@/components/layout";
import { ErrorState, When } from "@/components/state-full-widgets";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Menu, MenuItem, MenuItemLabel } from "@/components/ui/menu";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useClient } from "@/hooks/useClients";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowRightLeft,
  MoreVertical,
  Printer,
  UserPlus,
} from "lucide-react-native";
import React from "react";
import { ScrollView } from "react-native";

const ClientDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { client, isLoading, error } = useClient(id);

  return (
    <ScreenLayout title="Client Detail">
      <When
        asyncState={{ isLoading, error, data: client }}
        error={(e) => <ErrorState error={e} />}
        loading={() => <Spinner color="primary" />}
        success={(client) => (
          <ScrollView showsVerticalScrollIndicator={false}>
            <VStack space="lg" className="flex-1">
              <HStack className="justify-between items-center">
                <VStack>
                  <Heading size="lg">
                    {`${client?.firstName || ""} ${
                      client?.lastName || ""
                    }`.trim()}
                  </Heading>
                  <Text size="sm" className="text-typography-500">
                    Client Profile and Screening History
                  </Text>
                </VStack>
                <Menu
                  placement="bottom right"
                  offset={5}
                  disabledKeys={["Settings"]}
                  trigger={({ ...triggerProps }) => {
                    return (
                      <Button
                        className="p-0 bg-background-0"
                        action="secondary"
                        style={{ aspectRatio: 1 }}
                        {...triggerProps}
                      >
                        <ButtonIcon
                          as={MoreVertical}
                          size="md"
                          className="text-typography-950"
                        />
                      </Button>
                    );
                  }}
                >
                  <MenuItem
                    key="Screen Client"
                    textValue="Screen Client"
                    onPress={() =>
                      router.push({
                        pathname: "/screen-client",
                        params: {
                          client: client?.id,
                          search: client?.nationalId,
                        },
                      })
                    }
                  >
                    <Icon as={UserPlus} size="sm" className="mr-2" />
                    <MenuItemLabel size="sm">Screen Client</MenuItemLabel>
                  </MenuItem>
                  <MenuItem
                    key="Refer Client"
                    textValue="Refer Client"
                    onPress={() =>
                      router.push({
                        pathname: "/add-referral",
                        params: {
                          client: client?.id,
                          search: client?.nationalId,
                        },
                      })
                    }
                  >
                    <Icon as={ArrowRightLeft} size="sm" className="mr-2" />
                    <MenuItemLabel size="sm">Refer Client</MenuItemLabel>
                  </MenuItem>
                  <MenuItem key="Print Summary" textValue="Print Summary">
                    <Icon as={Printer} size="sm" className="mr-2" />
                    <MenuItemLabel size="sm">Print Summary</MenuItemLabel>
                  </MenuItem>
                </Menu>
              </HStack>
              <ClientInfo client={client!} />
              {!!client?.screenings?.length && (
                <RiskTratification client={client!} />
              )}
              <ScreeningHistory client={client!} />
              <ReferralHistory client={client!} />
              <FollowUpHistory client={client!} />
            </VStack>
          </ScrollView>
        )}
      />
    </ScreenLayout>
  );
};

export default ClientDetail;
