import { useClaimApi } from "@/hooks/use-claims";
import { handleApiErrors, uploadFile } from "@/lib/api";
import { claimFormSchema } from "@/lib/schemas";
import { ClaimFormData } from "@/types/claim";
import { Match } from "@/types/matches";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import React, { FC, useState } from "react";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { ScrollView } from "react-native";
import { Button } from "../button";
import { DocumentScannerInput } from "../cases";
import { CollapsibleFormSection, FormTextArea } from "../form-inputs";
import Toaster from "../toaster";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "../ui/form-control";
import { AlertCircleIcon } from "../ui/icon";
import { Text } from "../ui/text";
import { useToast } from "../ui/toast";
import { VStack } from "../ui/vstack";

type ClaimFormProps = {
  match: Match;
};

const ClaimForm: FC<ClaimFormProps> = ({ match }) => {
  const form = useForm({
    resolver: zodResolver(claimFormSchema),
    defaultValues: {
      securityQuestions: match.foundDocumentCase.securityQuestion.map((q) => ({
        question: q.question,
        response: "",
      })),
      matchId: match.id,
    },
  });
  const toast = useToast();
  const { claimMatch } = useClaimApi();
  const [scanned, setScanned] = useState<string[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  const { fields } = useFieldArray({
    control: form.control,
    name: "securityQuestions",
  });

  const onSubmit: SubmitHandler<ClaimFormData> = async (data) => {
    try {
      if (!scanned.length) {
        toast.show({
          placement: "top",
          render: ({ id }) => {
            const uniqueToastId = "toast-" + id;
            return (
              <Toaster
                uniqueToastId={uniqueToastId}
                variant="outline"
                title="Failed to claim document"
                description={"No scanned document"}
                action="error"
              />
            );
          },
        });
        return;
      }
      setUploadingFiles(true);
      const uploads = await Promise.allSettled(
        scanned.map((uri) => uploadFile(uri)),
      );
      setUploadingFiles(false);
      const uploadSuccesfull = uploads.every((k) => k.status === "fulfilled");
      if (!uploadSuccesfull) {
        const errors = uploads
          .filter((u) => u.status === "rejected")
          .map((u) => u.reason?.message)
          .join(", ");
        toast.show({
          placement: "top",
          render: ({ id }) => {
            const uniqueToastId = "toast-" + id;
            return (
              <Toaster
                uniqueToastId={uniqueToastId}
                variant="outline"
                title="File upload failed"
                description={errors}
                action="error"
              />
            );
          },
        });
        return;
      }
      await claimMatch({
        ...data,
        attachments: uploads
          .filter((u) => u.status === "fulfilled")
          .map((u) => u.value),
      });
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toaster
            uniqueToastId={`toast-${id}`}
            variant="outline"
            title="Submitted"
            description="Claim submitted succesfully"
            action="success"
          />
        ),
      });
      router.back();
    } catch (error) {
      const e = handleApiErrors<ClaimFormData>(error);
      if ("detail" in e && e.detail) {
        toast.show({
          placement: "top",
          render: ({ id }) => (
            <Toaster
              uniqueToastId={`toast-${id}`}
              variant="outline"
              title="Failed to submit claim"
              description={e.detail}
              action="error"
            />
          ),
        });
      } else {
        Object.entries(e).forEach(([key, val]) =>
          form.setError(key as keyof ClaimFormData, {
            message: val as string,
          }),
        );
      }
    }
  };

  return (
    <ScrollView>
      <VStack space="lg">
        <CollapsibleFormSection title="Support document">
          <DocumentScannerInput
            onScannedDocumentsChange={setScanned}
            maxNumDocuments={2}
          />
        </CollapsibleFormSection>
        <CollapsibleFormSection
          defaultCollapsed
          title="Security Question(Proof of ownership)"
        >
          {fields.length === 0 ? (
            <Text className="text-typography-500 text-center py-4">
              No Security Questions.
            </Text>
          ) : (
            <VStack space="md">
              {fields.map((field, index) => (
                <VStack key={field.id} className="items-END" space="sm">
                  <Controller
                    control={form.control}
                    name={`securityQuestions.${index}.question`}
                    render={({ field, fieldState: { invalid, error } }) => (
                      <FormControl
                        isInvalid={invalid}
                        size="md"
                        isDisabled={false}
                        isReadOnly={false}
                        isRequired={false}
                      >
                        <FormControlLabel>
                          <FormControlLabelText>
                            {field.value}
                          </FormControlLabelText>
                        </FormControlLabel>
                        {!!error && (
                          <FormControlError>
                            <FormControlErrorIcon
                              as={AlertCircleIcon}
                              className="text-red-500"
                            />
                            <FormControlErrorText className="text-red-500">
                              {error?.message}
                            </FormControlErrorText>
                          </FormControlError>
                        )}
                      </FormControl>
                    )}
                  />
                  <FormTextArea
                    controll={form.control}
                    name={`securityQuestions.${index}.response`}
                    placeholder="Type response here ..."
                  />
                </VStack>
              ))}
            </VStack>
          )}
        </CollapsibleFormSection>

        <Button
          text="Submit Claim"
          suffixIcon={ArrowRight}
          onPress={form.handleSubmit(onSubmit)}
          loading={form.formState.isSubmitting || uploadingFiles}
          className="bg-teal-500"
        />
      </VStack>
    </ScrollView>
  );
};

export default ClaimForm;
