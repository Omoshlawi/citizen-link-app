import React, { FC, PropsWithChildren } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const SafeAreaScreen: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SafeAreaView className="flex-1  bg-background-app">
      {children}
    </SafeAreaView>
  );
};

export default SafeAreaScreen;
