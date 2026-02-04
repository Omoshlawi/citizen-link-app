import React from "react";
import { ScrollView } from "react-native";
import { Box } from "../ui/box";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

const MannuallyAddLostDocumentForm = () => {
  return (
    <Box className="flex flex-1 w-full mt-2">
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack className="w-full items-center" space="sm">
          <Text>Os hera</Text>
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default MannuallyAddLostDocumentForm;
