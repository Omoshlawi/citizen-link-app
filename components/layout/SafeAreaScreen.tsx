import { STATUS_BAR_HEIGHT } from "@/lib/constants";
import React, { FC, PropsWithChildren } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { Box } from "../ui/box";

const SafeAreaScreen: FC<PropsWithChildren & { mode?: "padded" | "lib" }> = ({
  children,
  mode = "lib",
}) => {
  if (mode === "padded")
    return (
      <Box
        className={`bg-background-app h-full`}
        style={{ paddingTop: STATUS_BAR_HEIGHT }}
      >
        {children}
      </Box>
    );

  return (
    <SafeAreaView className="flex-1 bg-background-app  h-full ">
      {children}
    </SafeAreaView>
  );
};

export default SafeAreaScreen;
