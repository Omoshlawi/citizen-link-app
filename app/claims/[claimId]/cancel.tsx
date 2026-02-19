import { Button } from "@/components/button";
import { FormSelectInput, FormTextArea } from "@/components/form-inputs";
import { ScreenLayout } from "@/components/layout";
import Toaster from "@/components/toaster";
import { useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { useClaimApi } from "@/hooks/use-claims";
import { useTransitionReasons } from "@/hooks/use-transition-reasons";
import { handleApiErrors } from "@/lib/api";
import { cancelClaimSchema } from "@/lib/schemas";
import { CancelClaimFormData } from "@/types/claim";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const CancelDocumentClaim = () => {
  const { claimId, claimStatus } = useLocalSearchParams<{
    claimId: string;
    claimStatus?: string;
  }>();
  const toast = useToast();
  const { cancelClaim } = useClaimApi();
  const form = useForm({
    resolver: zodResolver(cancelClaimSchema),
    defaultValues: { reason: "INVALID_SUBMISSION" },
  });
  const { reasons } = useTransitionReasons({
    entityType: "Claim",
    fromStatus: claimStatus,
    toStatus: "CANCELLED",
  });

  const onSubmit: SubmitHandler<CancelClaimFormData> = async (data) => {
    try {
      await cancelClaim(claimId, data);
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          return (
            <Toaster
              uniqueToastId={uniqueToastId}
              variant="outline"
              title="Success"
              description="Claim successfully canceled"
              action="success"
            />
          );
        },
      });
      router.back();
    } catch (error) {
      const errors = handleApiErrors(error);
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          return (
            <Toaster
              uniqueToastId={uniqueToastId}
              variant="outline"
              title="Failed to cancel claim"
              description={errors?.detail}
              action="error"
            />
          );
        },
      });
    }
  };
  return (
    <ScreenLayout title="Cancel Claim">
      <VStack space="lg">
        <FormSelectInput
          data={reasons.map((r) => ({
            value: r.id,
            label: r.label,
          }))}
          controll={form.control}
          name="reason"
          label="Reason"
          helperText="Reason for canceling claim"
        />
        <FormTextArea
          controll={form.control}
          name="comment"
          label="Comment"
          helperText="Additional comments"
        />
        <Button
          text="Cancel Claim"
          suffixIcon={ArrowRight}
          onPress={form.handleSubmit(onSubmit)}
          loading={form.formState.isSubmitting}
          className="bg-error-500"
        />
      </VStack>
    </ScreenLayout>
  );
};

export default CancelDocumentClaim;
