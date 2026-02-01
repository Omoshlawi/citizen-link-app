import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

import LocalAuthModal from "@/components/auth/LocalAuthModal";
import Toaster from "@/components/toaster";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useToast } from "@/components/ui/toast";
import "@/global.css";
import { ApiConfigProvider } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { isLocalAuthEnabled } from "@/lib/local-auth";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";

export const unstable_settings = {
  anchor: "(tabs)",
};
// Prevent the splash screen from auto-hiding before asset and auth state loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const theme = useColorScheme();
  const { data, isPending, error } = authClient.useSession();
  const isLoggedIn = !!data?.user?.id;
  const toast = useToast();
  const [showLocalAuth, setShowLocalAuth] = useState(false);
  const appState = useRef(AppState.currentState);
  // Ref to avoid stale closures in the AppState listener
  const isLoggedInRef = useRef(isLoggedIn);
  const hasGoneToBackground = useRef(false);

  // Sync the ref whenever isLoggedIn changes
  useEffect(() => {
    isLoggedInRef.current = isLoggedIn;
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isPending) {
      SplashScreen.hideAsync();
    }
    if (error) {
      toast.show({
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          return (
            <Toaster
              uniqueToastId={uniqueToastId}
              variant="outline"
              title="Login failed"
              description={error.message}
              action="error"
            />
          );
        },
      });
    }
  }, [isPending, error, toast]);

  // Handle app state changes for local authentication
  useEffect(() => {
    const handleStateChange = async (nextAppState: AppStateStatus) => {
      // 1. If not logged in, we don't care about local auth
      if (!isLoggedInRef.current) return;

      // 2. Logic for coming back to foreground
      // We check if previous state was 'background' or 'inactive' and new is 'active'
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App returned to foreground");

        const enabled = await isLocalAuthEnabled();
        if (enabled) {
          // Trigger modal
          setShowLocalAuth(true);
        }
      }

      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener("change", handleStateChange);

    return () => {
      subscription.remove();
    };
  }, []); // Empty dependency array: listener is established once
  return (
    <ApiConfigProvider>
      <GluestackUIProvider mode={theme}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Protected guard={isLoggedIn}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="settings" options={{ headerShown: false }} />
            <Stack.Screen
              name="document-case"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="notifications"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="activities"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen name="faq" options={{ headerShown: false }} />
          </Stack.Protected>
          <Stack.Protected guard={!isLoggedIn}>
            <Stack.Screen name="auth" options={{ headerShown: false }} />
            <Stack.Screen name="two-factor" options={{ headerShown: false }} />
          </Stack.Protected>
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack>
        <StatusBar style={"auto"} backgroundColor="green" />
        {/* Render Modal outside the Stack so it overlays everything */}
        {isLoggedIn && (
          <LocalAuthModal
            visible={showLocalAuth}
            onSuccess={() => setShowLocalAuth(false)}
            // Ensure you have an onCancel or similar to handle
            // what happens if they fail/cancel the biometric
          />
        )}
      </GluestackUIProvider>
    </ApiConfigProvider>
  );
}
