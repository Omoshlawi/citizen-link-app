import { useClaims } from "@/hooks/use-claims";
import { useDocumentCase } from "@/hooks/use-document-cases";
import { ClaimStatus } from "@/types/claim";
import { ArrowRight } from "lucide-react-native";
import React, { FC } from "react";
import { Button } from "../button";
import { ProtectedImages } from "../image";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "../ui/actionsheet";
import { Spinner } from "../ui/spinner";
import { VStack } from "../ui/vstack";

type ClaimedDocumentDetailsProps = {
  matchId: string;
  claimId?: string;
};

const ViewVerifiedClaimedDocumentDetails: FC<ClaimedDocumentDetailsProps> = ({
  matchId,
  claimId,
}) => {
  const { claims, isLoading: isLoadingClaims } = useClaims({
    matchId,
    orderBy: "-createdAt",
  });
  const latestClaims = claims?.[0];
  const { isLoading: isLoadingDocumentCase, report } = useDocumentCase(
    latestClaims?.foundDocumentCase?.caseId,
  );
  const [showActionsheet, setShowActionsheet] = React.useState(false);
  const handleClose = () => setShowActionsheet(false);
  if (isLoadingClaims || isLoadingDocumentCase) return <Spinner />;
  if (latestClaims.status !== ClaimStatus.VERIFIED) return null;
  return (
    <>
      <Button
        text="View claimed document details"
        size="lg"
        className="rounded-full bg-primary-500 justify-between"
        onPress={() => {
          setShowActionsheet(true);
        }}
        suffixIcon={ArrowRight}
      />
      <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <VStack>
            <ProtectedImages
              images={report?.document?.images.map((at) => at.url)}
            />
          </VStack>
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
};

export default ViewVerifiedClaimedDocumentDetails;
