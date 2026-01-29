import ActionSheetWrapper from "@/components/actions-sheet-wrapper";
import AppBar from "@/components/app-bar";
import LocalAuthSetup from "@/components/auth/LocalAuthSetup";
import TwoFactorSetup from "@/components/auth/TwoFactorSetup";
import ListTile from "@/components/list-tile";
import Toaster from "@/components/toaster";
import { AlertDialog } from "@/components/ui/alert-dialog";
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTwoFactorAuth } from "@/hooks/use-two-factor-auth";
import { authClient } from "@/lib/auth-client";
import { getInitials } from "@/lib/helpers";
import {
  clearPin,
  isLocalAuthEnabled,
  isLocalAuthSetup,
  setBiometricEnabled,
  setLocalAuthEnabled,
} from "@/lib/local-auth";
import { Theme, useThemeStore } from "@/store/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const SettingsScreen = () => {
  const { data: userSession } = authClient.useSession();
  const colorScheme = useColorScheme();
  const setTheme = useThemeStore((state) => state.setTheme);
  const router = useRouter();
  const toast = useToast();
  const [localAuthEnabled, setLocalAuthEnabledState] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showDisableLocalAuthDialog, setShowDisableLocalAuthDialog] =
    useState(false);

  // 2FA hook handles all 2FA-related state and logic
  const {
    twoFactorEnabled,
    isChecking2FA,
    show2FASetup,
    showDisable2FA,
    disablePassword,
    setShowDisable2FA,
    setDisablePassword,
    handle2FAToggle,
    handleDisable2FA,
    handle2FASetupComplete,
    handle2FASetupCancel,
  } = useTwoFactorAuth();

  useEffect(() => {
    checkLocalAuthStatus();
  }, []);

  const checkLocalAuthStatus = async () => {
    setIsChecking(true);
    try {
      const enabled = await isLocalAuthEnabled();
      setLocalAuthEnabledState(enabled);
    } catch (error) {
      console.error("Error checking local auth status:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleLocalAuthToggle = async (value: boolean) => {
    if (value) {
      // Check if local auth is already set up
      const isSetup = await isLocalAuthSetup();
      if (isSetup) {
        // Already set up, just enable it
        await setLocalAuthEnabled(true);
        setLocalAuthEnabledState(true);
      } else {
        // Need to set up first
        setShowSetup(true);
      }
    } else {
      // Disable local auth - show dialog
      setShowDisableLocalAuthDialog(true);
    }
  };

  const handleDisableLocalAuth = async () => {
    // Clear PIN and disable biometrics when disabling local auth
    await clearPin();
    await setBiometricEnabled(false);
    await setLocalAuthEnabled(false);
    setLocalAuthEnabledState(false);
    setShowDisableLocalAuthDialog(false);
  };

  const handleSetupComplete = async () => {
    await setLocalAuthEnabled(true);
    setLocalAuthEnabledState(true);
    setShowSetup(false);
  };

  const handleSetupCancel = () => {
    setShowSetup(false);
  };

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    authClient.signOut();
    setShowLogoutDialog(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <AppBar title="Settings" />
      <ScrollView>
        <VStack className="flex-1 bg-background-50 p-4" space="xl">
          <Card
            size="lg"
            variant="filled"
            className="rounded-none bg-background-0 p-4"
          >
            <HStack space="lg">
              <Avatar size="md">
                <AvatarFallbackText>
                  {userSession?.user?.name
                    ? getInitials(userSession?.user?.name)
                    : "N/A"}
                </AvatarFallbackText>
                <AvatarImage
                  source={{
                    uri: userSession?.user?.image ?? "",
                  }}
                />
                <AvatarBadge />
              </Avatar>
              <VStack space="xs">
                <Heading size="md" className="mb-1">
                  {userSession?.user?.name}
                </Heading>
                <Text size="sm">{userSession?.user?.email}</Text>
              </VStack>
            </HStack>
          </Card>
          <Card
            size="lg"
            variant="filled"
            className="rounded-none bg-background-0 p-4"
          >
            <VStack space="lg">
              <Box>
                <Heading size="md" className="mb-1">
                  Security and Privacy
                </Heading>
                <Divider className="my-0.5" />
                <ListTile
                  leading={
                    <MaterialCommunityIcons
                      name="key-outline"
                      size={24}
                      color={colorScheme === "dark" ? "white" : "black"}
                    />
                  }
                  title="Change Password"
                  description="Change your password to secure your account."
                  onPress={() => router.push("/settings/change-password")}
                  trailing={
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={16}
                      color={colorScheme === "dark" ? "white" : "black"}
                    />
                  }
                />
                <ListTile
                  leading={
                    <MaterialCommunityIcons
                      name="fingerprint"
                      size={24}
                      color={colorScheme === "dark" ? "white" : "black"}
                    />
                  }
                  title="Local Authentication"
                  description="Use fingerprint or PIN when app comes to foreground."
                  trailing={
                    <Switch
                      size="md"
                      isDisabled={isChecking}
                      value={localAuthEnabled}
                      onValueChange={handleLocalAuthToggle}
                      trackColor={{ false: "#d4d4d4", true: "#525252" }}
                      thumbColor="#fafafa"
                      ios_backgroundColor="#d4d4d4"
                    />
                  }
                />
                <ListTile
                  leading={
                    <MaterialCommunityIcons
                      name="lock-outline"
                      size={24}
                      color={colorScheme === "dark" ? "white" : "black"}
                    />
                  }
                  title="Two-Factor Authentication"
                  description={
                    twoFactorEnabled
                      ? "Two-factor authentication is enabled"
                      : "Enable two-factor authentication to secure your account."
                  }
                  trailing={
                    <Switch
                      size="md"
                      isDisabled={isChecking2FA}
                      value={twoFactorEnabled}
                      onValueChange={handle2FAToggle}
                      trackColor={{ false: "#d4d4d4", true: "#525252" }}
                      thumbColor="#fafafa"
                      ios_backgroundColor="#d4d4d4"
                    />
                  }
                />
              </Box>
            </VStack>
          </Card>
          <Card
            size="lg"
            variant="filled"
            className="rounded-none bg-background-0 p-4"
          >
            <VStack space="lg">
              <Box>
                <Heading size="md" className="mb-1">
                  App Preferences
                </Heading>
                <Divider className="my-0.5" />
                {/* <ActionSheetWrapper
                  renderTrigger={({ onPress }) => (
                    <ListTile
                      onPress={onPress}
                      leading={
                        <Ionicons
                          name="language-outline"
                          size={24}
                          color={colorScheme === "dark" ? "white" : "black"}
                        />
                      }
                      title="Language"
                      description="Select your preferred language."
                      trailing={
                        <MaterialCommunityIcons
                          name="chevron-right"
                          size={24}
                          color={colorScheme === "dark" ? "white" : "black"}
                        />
                      }
                    />
                  )}
                  data={[
                    { label: "English", value: "en" },
                    { label: "Spanish", value: "es" },
                    { label: "French", value: "fr" },
                    { label: "German", value: "de" },
                    { label: "Italian", value: "it" },
                  ]}
                  renderItem={({ item, close }) => (
                    <TouchableOpacity
                      onPress={() => {
                        close();
                      }}
                    >
                      <Card
                        size="md"
                        variant="filled"
                        className="rounded-none bg-background-0 p-4"
                      >
                        <HStack
                          space="lg"
                          className="items-center justify-between"
                        >
                          <Text size="md" className="text-start flex-1">
                            {item.label}
                          </Text>
                          <MaterialCommunityIcons
                            name="chevron-right"
                            size={20}
                            color={colorScheme === "dark" ? "white" : "black"}
                          />
                        </HStack>
                      </Card>
                    </TouchableOpacity>
                  )}
                  valueExtractor={(item) => item.value}
                /> */}
                <ActionSheetWrapper
                  renderTrigger={({ onPress }) => (
                    <ListTile
                      onPress={onPress}
                      leading={
                        <MaterialCommunityIcons
                          name="theme-light-dark"
                          size={24}
                          color={colorScheme === "dark" ? "white" : "black"}
                        />
                      }
                      title="Theme"
                      description="Select your preferred theme."
                      trailing={
                        <MaterialCommunityIcons
                          name="chevron-right"
                          size={24}
                          color={colorScheme === "dark" ? "white" : "black"}
                        />
                      }
                    />
                  )}
                  data={[
                    { label: "Light", value: "light" },
                    { label: "Dark", value: "dark" },
                    { label: "System", value: "system" },
                  ]}
                  renderItem={({ item, close }) => (
                    <TouchableOpacity
                      onPress={() => {
                        close();
                        setTheme(item.value as Theme);
                      }}
                    >
                      <Card
                        size="md"
                        variant="filled"
                        className="rounded-none bg-background-0 p-4"
                      >
                        <HStack
                          space="lg"
                          className="items-center justify-between"
                        >
                          <MaterialCommunityIcons
                            name={
                              item.value === "light"
                                ? "weather-sunny"
                                : item.value === "dark"
                                  ? "weather-night"
                                  : "weather-sunny-alert"
                            }
                            size={20}
                            color={colorScheme === "dark" ? "white" : "black"}
                          />
                          <Text size="md" className="text-start flex-1">
                            {item.label}
                          </Text>
                          <MaterialCommunityIcons
                            name="chevron-right"
                            size={24}
                            color={colorScheme === "dark" ? "white" : "black"}
                          />
                        </HStack>
                      </Card>
                    </TouchableOpacity>
                  )}
                  valueExtractor={(item) => item.value}
                />
              </Box>
            </VStack>
          </Card>
          <Card
            size="lg"
            variant="filled"
            className="rounded-none bg-background-0 p-4"
          >
            <VStack space="lg">
              <Box>
                <Heading size="md" className="mb-1">
                  Support
                </Heading>
                <Divider className="my-0.5" />
                <ListTile
                  description="Frequently asked questions (FAQ)"
                  onPress={() => router.push("/faq")}
                  trailing={
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={16}
                      color={colorScheme === "dark" ? "white" : "black"}
                    />
                  }
                />
                <ListTile
                  description="Help and Support"
                  trailing={
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={16}
                      color={colorScheme === "dark" ? "white" : "black"}
                    />
                  }
                />
                <ListTile
                  description="Privacy Policy"
                  trailing={
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={16}
                      color={colorScheme === "dark" ? "white" : "black"}
                    />
                  }
                />
                <ListTile
                  description="Terms of Service"
                  trailing={
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={16}
                      color={colorScheme === "dark" ? "white" : "black"}
                    />
                  }
                />
              </Box>
            </VStack>
          </Card>
          <Button action="negative" onPress={handleLogout}>
            <Text className="font-bold">Logout</Text>
          </Button>
        </VStack>
        <Modal
          visible={showSetup}
          transparent
          animationType="slide"
          statusBarTranslucent
          onRequestClose={handleSetupCancel}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={handleSetupCancel}
          >
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor:
                    colorScheme === "dark"
                      ? "rgba(0, 0, 0, 0.6)"
                      : "rgba(0, 0, 0, 0.5)",
                },
              ]}
            />
          </Pressable>
          <LocalAuthSetup
            onComplete={handleSetupComplete}
            onCancel={handleSetupCancel}
          />
        </Modal>
        <TwoFactorSetup
          visible={show2FASetup}
          onComplete={handle2FASetupComplete}
          onCancel={handle2FASetupCancel}
        />
        <Modal
          visible={showDisable2FA}
          transparent
          animationType="slide"
          statusBarTranslucent
          onRequestClose={() => {
            setShowDisable2FA(false);
            setDisablePassword("");
          }}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => {
              setShowDisable2FA(false);
              setDisablePassword("");
            }}
          >
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor:
                    colorScheme === "dark"
                      ? "rgba(0, 0, 0, 0.8)"
                      : "rgba(0, 0, 0, 0.6)",
                },
              ]}
            />
          </Pressable>
          <Box className="absolute bottom-0 left-0 right-0 bg-background-0 rounded-t-3xl p-6">
            <VStack space="lg">
              <HStack className="items-center justify-between mb-4">
                <Text className="text-2xl font-bold">
                  Disable Two-Factor Authentication
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowDisable2FA(false);
                    setDisablePassword("");
                  }}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={24}
                    color={colorScheme === "dark" ? "white" : "black"}
                  />
                </TouchableOpacity>
              </HStack>
              <Text className="text-sm text-typography-500">
                Enter your password to disable two-factor authentication
              </Text>
              <Input variant="outline" size="lg">
                <InputField
                  placeholder="Enter your password"
                  value={disablePassword}
                  onChangeText={setDisablePassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoFocus
                />
              </Input>
              <HStack space="md">
                <Button
                  variant="outline"
                  onPress={() => {
                    setShowDisable2FA(false);
                    setDisablePassword("");
                  }}
                  className="flex-1"
                >
                  <ButtonText>Cancel</ButtonText>
                </Button>
                <Button
                  action="negative"
                  onPress={async () => {
                    const result = await handleDisable2FA();
                    if (!result.success) {
                      toast.show({
                        placement: "top",
                        render: ({ id }) => {
                          const uniqueToastId = "toast-" + id;
                          return (
                            <Toaster
                              uniqueToastId={uniqueToastId}
                              variant="outline"
                              title="Error"
                              description={
                                result.error || "Failed to disable 2FA"
                              }
                              action="error"
                            />
                          );
                        },
                      });
                    } else {
                      toast.show({
                        placement: "top",
                        render: ({ id }) => {
                          const uniqueToastId = "toast-" + id;
                          return (
                            <Toaster
                              uniqueToastId={uniqueToastId}
                              variant="outline"
                              title="Success"
                              description="Two-factor authentication has been disabled"
                              action="success"
                            />
                          );
                        },
                      });
                    }
                  }}
                  disabled={!disablePassword}
                  className="flex-1"
                >
                  <ButtonText>Disable</ButtonText>
                </Button>
              </HStack>
            </VStack>
          </Box>
        </Modal>
        <AlertDialog
          isOpen={showLogoutDialog}
          onClose={() => setShowLogoutDialog(false)}
          title="Logout"
          message="Are you sure you want to logout?"
          confirmText="Logout"
          cancelText="Cancel"
          onConfirm={confirmLogout}
          onCancel={() => setShowLogoutDialog(false)}
          variant="destructive"
        />
        <AlertDialog
          isOpen={showDisableLocalAuthDialog}
          onClose={() => setShowDisableLocalAuthDialog(false)}
          title="Disable Local Authentication?"
          message="This will disable biometric and PIN authentication. Your PIN will be cleared and you'll need to set it up again if you re-enable this feature."
          confirmText="Disable"
          cancelText="Cancel"
          onConfirm={handleDisableLocalAuth}
          onCancel={() => setShowDisableLocalAuthDialog(false)}
          variant="destructive"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
