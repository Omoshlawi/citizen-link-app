import { ScreenLayout } from "@/components/layout";
import {
  AppPreferencesSection,
  SecurityAndPrivacySection,
  SupportSection,
  UserSection,
} from "@/components/settings";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { authClient } from "@/lib/auth-client";
import { ArrowRight, LogOut } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView } from "react-native";
const SettingsScreen = () => {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    authClient.signOut();
    setShowLogoutDialog(false);
  };

  return (
    <ScreenLayout title="Settings">
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack className="flex-1  p-2" space="lg">
          <UserSection />
          <SecurityAndPrivacySection />
          <AppPreferencesSection />
          <SupportSection />
          <Button
            action="negative"
            onPress={handleLogout}
            className="rounded-full justify-between"
          >
            <ButtonIcon as={LogOut} className="text-white" />
            <Text className="font-bold text-white">Logout</Text>
            <ButtonIcon as={ArrowRight} className="text-white" />
          </Button>
        </VStack>
      </ScrollView>
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
    </ScreenLayout>
  );
};

export default SettingsScreen;
