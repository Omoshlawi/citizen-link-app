import { useClaims } from "@/hooks/use-claims";
import { useDocumentCase } from "@/hooks/use-document-cases";
import { ClaimStatus } from "@/types/claim";
import cn from "classnames";
import { router } from "expo-router";
import { Calendar, MoreVertical, X } from "lucide-react-native";
import React, { FC } from "react";
import { Button, ButtonIcon } from "../ui/button";
import { Icon } from "../ui/icon";
import { Menu, MenuItem, MenuItemLabel, MenuSeparator } from "../ui/menu";
import { Spinner } from "../ui/spinner";

type ClaimActionsProps = {
  matchId?: string;
  claimId?: string;
};

const ClaimActions: FC<ClaimActionsProps> = ({ matchId, claimId }) => {
  const { isLoading: isLoadingClaims, claims } = useClaims({
    matchId: matchId,
    limit: 1,
    orderBy: "-createdAt",
  });

  const latestClaim = claims?.[0];

  const { report, isLoading: isLoadingCase } = useDocumentCase(
    latestClaim?.status !== ClaimStatus.VERIFIED
      ? undefined
      : latestClaim?.foundDocumentCase?.caseId,
  );

  const cancelableClaimStatus: ClaimStatus[] = [
    ClaimStatus.PENDING,
    ClaimStatus.DISPUTED,
  ];
  const disputableClaimStatus: ClaimStatus[] = [
    ClaimStatus.PENDING,
    ClaimStatus.DISPUTED,
  ];

  if (isLoadingClaims || isLoadingCase) return <Spinner />;

  if (latestClaim?.id !== claimId) return null;
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
        key="Cancel Claim"
        textValue="Cancel Claim"
        disabled={!cancelableClaimStatus.includes(latestClaim.status)}
        onPress={() => {
          router.push({
            pathname: "/claims/[claimId]/cancel",
            params: {
              claimId: latestClaim.id,
              claimStatus: latestClaim.status,
            },
          });
        }}
      >
        <Icon
          as={X}
          size="sm"
          className={cn("mr-2 text-error-500 ", {
            "text-gray-400": !cancelableClaimStatus.includes(
              latestClaim.status,
            ),
          })}
        />
        <MenuItemLabel
          size="sm"
          className={cn("text-error-500", {
            "text-gray-400": !cancelableClaimStatus.includes(
              latestClaim.status,
            ),
          })}
        >
          Cancel Claim
        </MenuItemLabel>
      </MenuItem>
      <MenuItem
        key="Dispute Claim"
        textValue="Dispute Claim"
        disabled={!disputableClaimStatus.includes(latestClaim.status)}
        onPress={() => {
          router.push({
            pathname: "/claims/[claimId]/dispute",
            params: {
              claimId: latestClaim.id,
              claimStatus: latestClaim.status,
            },
          });
        }}
      >
        <Icon
          as={X}
          size="sm"
          className={cn("mr-2 text-error-500", {
            "text-gray-400": !disputableClaimStatus.includes(
              latestClaim.status,
            ),
          })}
        />
        <MenuItemLabel
          size="sm"
          className={cn("text-error-500", {
            "text-gray-400": !disputableClaimStatus.includes(
              latestClaim.status,
            ),
          })}
        >
          Dispute Claim
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

export default ClaimActions;
