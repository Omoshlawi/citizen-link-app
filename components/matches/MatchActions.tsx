import { Match } from "@/types/matches";
import { ArrowRight } from "lucide-react-native";
import React, { FC } from "react";
import { Button, ButtonIcon, ButtonText } from "../ui/button";
import { VStack } from "../ui/vstack";

type MatchActionsProps = {
  match: Match;
};
const MatchActions: FC<MatchActionsProps> = ({ match }) => {
  return (
    <VStack space="sm" className="pt-4">
      <Button
        size="lg"
        variant="solid"
        action="secondary"
        className="rounded-full bg-teal-500 justify-between"
        onPress={() => {
          //   router.push({
          //     pathname: "/document-case/[caseId]/edit",
          //     params: { caseId: docCase.id },
          //   });
        }}
      >
        <ButtonText className="text-white">Claim Document</ButtonText>
        <ButtonIcon as={ArrowRight} className="text-white" />
      </Button>
    </VStack>
  );
};

export default MatchActions;
