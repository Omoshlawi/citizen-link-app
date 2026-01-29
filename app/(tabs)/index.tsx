import { RecentActivity, SummaryCards } from "@/components/home";
import LandingScreenLayout from "@/components/layout/LandingScreenLayout";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { authClient } from "@/lib/auth-client";
import dayjs from "dayjs";
import React from "react";
import { ScrollView } from "react-native";
export default function HomeScreen() {
  const { data: userSession } = authClient.useSession();
  return (
    <LandingScreenLayout>
      <Box className="flex-1 p-4">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text className="text-typography-link">
            {dayjs().format("ddd, MMM DD")}
            {/* {React.useSyncExternalStore(
                (cb) => {
                  const id = setInterval(cb, 1000);
                  return () => clearInterval(id);
                },
                () => new Date().toLocaleString()
              )} */}
          </Text>
          <Heading size="md" className="mb-1 ">
            {new Date().getHours() < 12
              ? "Good Morning"
              : new Date().getHours() < 18
              ? "Good Afternoon"
              : "Good Evening"}
            , {userSession?.user?.name}
          </Heading>

          <SummaryCards />
          <RecentActivity />
        </ScrollView>
      </Box>
    </LandingScreenLayout>
  );
}
