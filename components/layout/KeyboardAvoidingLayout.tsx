import React, { PropsWithChildren } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";

const KeyboardAvoidingLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default KeyboardAvoidingLayout;
