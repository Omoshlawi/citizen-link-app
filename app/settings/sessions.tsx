import { ScreenLayout } from "@/components/layout";
import Toaster from "@/components/toaster";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { useComputedColorScheme } from "@/hooks/use-color-scheme";
import { useSessions } from "@/hooks/use-session";
import { authClient } from "@/lib/auth-client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useState } from "react";
import { ActivityIndicator, FlatList } from "react-native";

dayjs.extend(relativeTime);

const getDeviceLabel = (userAgent: string): string => {
  if (!userAgent) return "Unknown Device";
  if (/android/i.test(userAgent)) return "Android Device";
  if (/iphone|ipad/i.test(userAgent)) return "Apple Device";
  if (/windows/i.test(userAgent)) return "Windows PC";
  if (/mac/i.test(userAgent)) return "Mac";
  return userAgent.slice(0, 40) + (userAgent.length > 40 ? "…" : "");
};

const getDeviceIcon = (userAgent: string): string => {
  if (!userAgent) return "💻";
  if (/android/i.test(userAgent)) return "📱";
  if (/iphone|ipad/i.test(userAgent)) return "🍎";
  if (/windows/i.test(userAgent)) return "🖥️";
  if (/mac/i.test(userAgent)) return "💻";
  return "🌐";
};

export default function SessionsScreen() {
  const colorScheme = useComputedColorScheme();
  const toast = useToast();
  const { sessions, error, isLoading, mutate } = useSessions();
  const { refetch } = authClient.useSession();
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [revokingAll, setRevokingAll] = useState(false);

  const showToast = (
    title: string,
    description: string,
    action: "success" | "error",
  ) => {
    toast.show({
      placement: "top",
      render: ({ id }) => (
        <Toaster
          uniqueToastId={`toast-${id}`}
          variant="outline"
          title={title}
          description={description}
          action={action}
        />
      ),
    });
  };

  const handleRevoke = async (token: string, sessionId: string) => {
    setRevokingId(sessionId);
    try {
      const result = await authClient.revokeSession({ token });
      if (result?.error) {
        showToast(
          "Error",
          result.error.message || "Failed to revoke session",
          "error",
        );
      } else {
        showToast(
          "Session Revoked",
          "The session has been revoked successfully.",
          "success",
        );
        mutate();
        refetch();
      }
    } catch {
      showToast("Error", "Failed to revoke session.", "error");
    } finally {
      setRevokingId(null);
    }
  };

  const handleRevokeAll = async () => {
    setRevokingAll(true);
    try {
      const result = await authClient.revokeOtherSessions();
      if (result?.error) {
        showToast(
          "Error",
          result.error.message || "Failed to revoke all sessions",
          "error",
        );
      } else {
        showToast(
          "All Sessions Revoked",
          "All other sessions have been signed out.",
          "success",
        );
        mutate();
        refetch();
      }
    } catch {
      showToast("Error", "Failed to revoke all sessions.", "error");
    } finally {
      setRevokingAll(false);
    }
  };

  if (isLoading) {
    return (
      <ScreenLayout title="Active Sessions">
        <Center className="flex-1">
          <ActivityIndicator
            size="large"
            color={colorScheme === "dark" ? "white" : "#0d9488"}
          />
        </Center>
      </ScreenLayout>
    );
  }

  if (error) {
    return (
      <ScreenLayout title="Active Sessions">
        <Center className="flex-1">
          <Text className="text-red-500 text-center">
            Failed to load sessions.
          </Text>
        </Center>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout title="Active Sessions">
      <FlatList
        data={sessions ?? []}
        keyExtractor={(item, index) => item.id ?? String(index)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32, gap: 12 }}
        refreshing={isLoading}
        onRefresh={() => mutate()}
        ListHeaderComponent={
          sessions && sessions.length > 1 ? (
            <Box className="mb-2">
              <HStack className="justify-between items-center mb-4">
                <VStack space="xs">
                  <Heading size="xs" className="text-typography-800">
                    {sessions.length} active session
                    {sessions.length !== 1 ? "s" : ""}
                  </Heading>
                  <Text size="xs" className="text-typography-400">
                    Revoke any session you don{"'"}t recognise
                  </Text>
                </VStack>
                <Button
                  action="negative"
                  variant="outline"
                  size="sm"
                  onPress={handleRevokeAll}
                  disabled={revokingAll}
                >
                  <ButtonText>
                    {revokingAll ? "Revoking…" : "Revoke All Others"}
                  </ButtonText>
                </Button>
              </HStack>
            </Box>
          ) : null
        }
        ListEmptyComponent={
          <Center className="py-16">
            <Text className="text-4xl mb-3">🔒</Text>
            <Text className="text-typography-500 font-medium" size="sm">
              No active sessions found
            </Text>
          </Center>
        }
        renderItem={({ item: session }) => {
          const isRevoking = revokingId === session.id;
          const deviceLabel = getDeviceLabel(session.userAgent ?? "");
          const deviceIcon = getDeviceIcon(session.userAgent ?? "");
          const lastActive = session.updatedAt || session.createdAt;

          return (
            <Card className="bg-background-0 dark:bg-background-btn rounded-2xl p-4 border border-outline-50">
              <VStack space="sm">
                {/* Device header */}
                <HStack space="sm" className="items-center">
                  <Text className="text-2xl">{deviceIcon}</Text>
                  <VStack className="flex-1">
                    <Text
                      className="font-semibold text-typography-900"
                      size="sm"
                      numberOfLines={1}
                    >
                      {deviceLabel}
                    </Text>
                    <Text size="xs" className="text-typography-400">
                      {session.ipAddress || "IP unknown"}
                    </Text>
                  </VStack>
                </HStack>

                {/* Divider */}
                <Box className="h-px bg-outline-50" />

                {/* Meta row */}
                <HStack className="justify-between items-center">
                  <Text size="xs" className="text-typography-400">
                    Last active
                  </Text>
                  <Text size="xs" className="text-typography-600 font-medium">
                    {dayjs(lastActive).fromNow()}
                  </Text>
                </HStack>

                <HStack className="justify-between items-center">
                  <Text size="xs" className="text-typography-400">
                    Created
                  </Text>
                  <Text size="xs" className="text-typography-600 font-medium">
                    {dayjs(session.createdAt).format("MMM D, YYYY")}
                  </Text>
                </HStack>

                {/* Revoke button */}
                <Button
                  action="negative"
                  variant="outline"
                  size="sm"
                  className="mt-1"
                  disabled={isRevoking}
                  onPress={() =>
                    handleRevoke(session.token || session.id, session.id)
                  }
                >
                  <ButtonText>
                    {isRevoking ? "Revoking…" : "Revoke Session"}
                  </ButtonText>
                </Button>
              </VStack>
            </Card>
          );
        }}
      />
    </ScreenLayout>
  );
}
