import { Button } from "@/components/button";
import { FormSelectInput, FormTextArea } from "@/components/form-inputs";
import { ScreenLayout } from "@/components/layout";
import Toaster from "@/components/toaster";
import { useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { useMatchApi } from "@/hooks/use-matches";
import { handleApiErrors } from "@/lib/api";
import { getMatchRejectReasons } from "@/lib/helpers";
import { rejectMatchSchema } from "@/lib/schemas";
import { RejectMatchFormData } from "@/types/matches";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import React, { useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
const RejectMatch = () => {
  const { matchId } = useLocalSearchParams<{ matchId: string }>();
  const { rejectMatch } = useMatchApi();
  const toast = useToast();
  const form = useForm({
    resolver: zodResolver(rejectMatchSchema),
    defaultValues: { reason: "OWNERSHIP_DENIED" },
  });

  const reasons = useMemo(() => {
    const _reason: RejectMatchFormData["reason"][] = [
      "DOCUMENT_SUPERSEDED",
      "OWNERSHIP_DENIED",
      "OTHER",
    ];
    return _reason.map((r) => ({
      value: r,
      label: getMatchRejectReasons(r) as string,
    }));
  }, []);

  const onSubmit: SubmitHandler<RejectMatchFormData> = async (data) => {
    try {
      await rejectMatch(matchId, data);
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          return (
            <Toaster
              uniqueToastId={uniqueToastId}
              variant="outline"
              title="Success"
              description="Match successfully rejected"
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
              title="Failed to reject match"
              description={errors?.detail}
              action="error"
            />
          );
        },
      });
    }
  };

  return (
    <ScreenLayout title="Reject Match">
      <VStack space="lg">
        <FormSelectInput
          data={reasons}
          controll={form.control}
          name="reason"
          label="Reason"
          helperText="Reason for canceling match"
        />
        <FormTextArea
          controll={form.control}
          name="comment"
          label="Comment"
          helperText="Additional comments"
        />
        <Button
          text="Reject Match"
          suffixIcon={ArrowRight}
          onPress={form.handleSubmit(onSubmit)}
          loading={form.formState.isSubmitting}
          className="bg-error-500"
        />
      </VStack>
    </ScreenLayout>
  );
};

export default RejectMatch;
