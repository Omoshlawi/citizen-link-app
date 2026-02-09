import { authClient } from "@/lib/auth-client";
import { Match } from "@/types/matches";
import { router } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import React, { FC, useMemo } from "react";
import { Button, ButtonIcon, ButtonText } from "../ui/button";
import { VStack } from "../ui/vstack";

type MatchActionsProps = {
  match: Match;
};
const MatchActions: FC<MatchActionsProps> = ({ match }) => {
  const { data: userSession, isPending } = authClient.useSession();
  const canClaim = useMemo(() => {
    return match?.foundDocumentCase.case?.userId !== userSession?.user.id;
  }, [match?.foundDocumentCase.case?.userId, userSession?.user.id]);
  if (isPending) return null;
  return (
    <VStack space="sm" className="pt-4">
      {canClaim && (
        <Button
          size="lg"
          variant="solid"
          action="secondary"
          className="rounded-full bg-teal-500 justify-between"
          onPress={() => {
            router.push({
              pathname: "/matches/[matchId]/claim",
              params: { matchId: match.id },
            });
          }}
        >
          <ButtonText className="text-white">Claim Document</ButtonText>
          <ButtonIcon as={ArrowRight} className="text-white" />
        </Button>
      )}
    </VStack>
  );
};

export default MatchActions;
