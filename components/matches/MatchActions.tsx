import { useClaims } from "@/hooks/use-claims";
import { useDocumentCase } from "@/hooks/use-document-cases";
import { useMatch } from "@/hooks/use-matches";
import { ClaimStatus } from "@/types/claim";
import { MatchStatus } from "@/types/matches";
import cn from "classnames";
import { router } from "expo-router";
import { Calendar, MoreVertical, X } from "lucide-react-native";
import React, { FC, useMemo } from "react";
import { Button, ButtonIcon } from "../ui/button";
import { AddIcon, Icon } from "../ui/icon";
import { Menu, MenuItem, MenuItemLabel, MenuSeparator } from "../ui/menu";
import { Spinner } from "../ui/spinner";

type MatchActionsProps = {
  isOwner: boolean;
  matchId: string;
};

const MatchActions: FC<MatchActionsProps> = ({ isOwner, matchId }) => {
  const {
    totalCount,
    isLoading: isLoadingClaims,
    claims,
  } = useClaims({
    matchId: matchId,
    limit: 1,
    orderBy: "-createdAt",
  });

  const latestClaim = claims?.[0];

  const { isLoading, match } = useMatch(matchId);

  const canClaim = useMemo(() => {
    if (!isOwner) return false; // None owners cant view claims
    if (totalCount === 0) return true; // Mean no claim is raised yet
    const latestClaimStatus = claims?.[0]?.status;
    return latestClaimStatus === ClaimStatus.CANCELLED;
  }, [claims, isOwner, totalCount]);
  const canRejectMatch = useMemo(() => {
    if (!isOwner) return false; // None owners cant view claims
    if (totalCount === 0) return true; // Mean no claim is raised yet
    return match?.status === MatchStatus.PENDING;
  }, [isOwner, match?.status, totalCount]);

  const { report, isLoading: isLoadingCase } = useDocumentCase(
    latestClaim?.status !== ClaimStatus.VERIFIED
      ? undefined
      : latestClaim?.foundDocumentCase?.caseId,
  );

  if (isLoading || isLoadingClaims || isLoadingCase) return <Spinner />;
  return (
    <Menu
      placement="top"
      offset={5}
      disabledKeys={["Settings"]}
      trigger={({ ...triggerProps }) => {
        return (
          <Button
            {...triggerProps}
            size="lg"
            className="rounded-full p-3.5"
            variant="link"
          >
            <ButtonIcon as={MoreVertical} />
          </Button>
        );
      }}
    >
      <MenuItem disabled textValue="Actions">
        <MenuItemLabel className="font-bold">Actions</MenuItemLabel>
      </MenuItem>
      <MenuSeparator />
      <MenuItem
        key="Claim Document"
        textValue="Claim Document"
        disabled={!canClaim}
        onPress={() => {
          router.push({
            pathname: "/claims/add",
            params: { matchId: matchId },
          });
        }}
      >
        <Icon
          as={AddIcon}
          size="sm"
          className={cn("mr-2 text-teal-500 ", { "text-gray-400": !canClaim })}
        />
        <MenuItemLabel
          size="sm"
          className={cn("text-teal-500", { "text-gray-400": !canClaim })}
        >
          Claim Document
        </MenuItemLabel>
      </MenuItem>
      <MenuItem
        key="Reject Match"
        textValue="Reject Match"
        disabled={!canRejectMatch}
        onPress={() => {
          router.push({
            pathname: "/matches/[matchId]/reject",
            params: {
              matchId: matchId,
              matchStatus: match?.status,
            },
          });
        }}
      >
        <Icon
          as={X}
          size="sm"
          className={cn("mr-2 text-error-500", {
            "text-gray-400": !canRejectMatch,
          })}
        />
        <MenuItemLabel
          size="sm"
          className={cn("text-error-500", { "text-gray-400": !canRejectMatch })}
        >
          Reject Match
        </MenuItemLabel>
      </MenuItem>
      <MenuItem
        key="Schedule collection"
        textValue="Schedule collection"
        disabled={!report}
        onPress={() => {
          router.push({
            pathname: "/claims/[claimId]/schedule-handover",
            params: {
              claimId: latestClaim?.id,
            },
          });
        }}
      >
        <Icon
          as={Calendar}
          size="sm"
          className={cn("mr-2 text-blue-500", {
            "text-gray-400": !report,
          })}
        />
        <MenuItemLabel
          size="sm"
          className={cn("text-blue-500", { "text-gray-400": !report })}
        >
          Schedule Collection
        </MenuItemLabel>
      </MenuItem>
    </Menu>
  );
};

export default MatchActions;
