import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { FC } from "react";
import { Button } from "./ui/button";
import { Heading } from "./ui/heading";
import { HStack } from "./ui/hstack";
import { Icon } from "./ui/icon";
type AppBarProps = {
  title: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
};
const AppBar: FC<AppBarProps> = ({ title, leading, trailing }) => {
  const router = useRouter();
  return (
    <HStack
      className="justify-between items-center p-2  bg-slate-200 dark:bg-slate-950"
      space="xs"
    >
      {leading ?? (
        <>
          {router.canGoBack() && (
            <Button action="default" onPress={() => router.back()}>
              <Icon as={ArrowLeft} size={"xl"} />
            </Button>
          )}
        </>
      )}
      <Heading className={"flex-1"} size="xl">
        {title}
      </Heading>
      {trailing}
    </HStack>
  );
};

export default AppBar;
