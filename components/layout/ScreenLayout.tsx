import React, { FC } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppBar } from "../common";
import { Box } from "../ui/box";
type ScreenLayoutProps = {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
};
const ScreenLayout: FC<ScreenLayoutProps> = ({ title, children, actions }) => {
  return (
    <SafeAreaView className="flex-1  bg-background-app">
      <AppBar title={title} trailing={actions} />
      <Box className="flex-1 p-4">{children}</Box>
    </SafeAreaView>
  );
};

export default ScreenLayout;
