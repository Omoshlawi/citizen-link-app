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
  const hasGoneToBackground = useRef(false);

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
    if (!isLoggedIn) {
      // Reset when logged out
      hasGoneToBackground.current = false;
      setShowLocalAuth(false);
      return;
    }

    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState: AppStateStatus) => {
        console.log("App state changed:", {
          previous: appState.current,
          next: nextAppState,
          hasGoneToBackground: hasGoneToBackground.current,
        });

        // Track when app goes to background
        if (
          appState.current === "active" &&
          nextAppState.match(/inactive|background/)
        ) {
          hasGoneToBackground.current = true;
          console.log("App went to background");
        }

        // Show local auth when app comes back to foreground after being in background
        if (
          hasGoneToBackground.current &&
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          console.log("App came to foreground, checking local auth");
          // Small delay to ensure app is fully active
          setTimeout(async () => {
            const enabled = await isLocalAuthEnabled();
            console.log("Local auth enabled:", enabled);
            if (enabled) {
              console.log("Showing local auth modal");
              setShowLocalAuth(true);
            }
          }, 100);
          // Reset the flag after checking
          hasGoneToBackground.current = false;
        }

        appState.current = nextAppState;
      }
    );

    return () => {
      subscription.remove();
    };
  }, [isLoggedIn]);

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
        {isLoggedIn && (
          <LocalAuthModal
            visible={showLocalAuth}
            onSuccess={() => setShowLocalAuth(false)}
          />
        )}
      </GluestackUIProvider>
    </ApiConfigProvider>
  );
}
