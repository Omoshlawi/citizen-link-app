import { useDocumentCaseApi } from "@/hooks/use-document-cases";
import { useDocumentTypes } from "@/hooks/use-document-types";
import { handleApiErrors } from "@/lib/api";
import { caseDocumentSchema } from "@/lib/schemas";
import { CaseDocumentFormData, DocumentCase } from "@/types/cases";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { ArrowRight, Plus, Trash } from "lucide-react-native";
import React, { FC } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { ScrollView } from "react-native";
import {
  CollapsibleFormSection,
  FormDatePicker,
  FormSelectInput,
  FormTextArea,
  FormTextInput,
} from "../form-inputs";
import Toaster from "../toaster";
import { Button, ButtonIcon, ButtonSpinner, ButtonText } from "../ui/button";
import { Divider } from "../ui/divider";
import { Text } from "../ui/text";
import { useToast } from "../ui/toast";
import { VStack } from "../ui/vstack";

type EditDocumentCaseFormProps = {
  documentCase: DocumentCase;
};
const EditDocumentCaseForm: FC<EditDocumentCaseFormProps> = ({
  documentCase,
}) => {
  const { document } = documentCase;
  const form = useForm({
    defaultValues: {
      typeId: document?.typeId ?? undefined,
      ownerName: document?.ownerName ?? undefined,
      serialNumber: document?.serialNumber ?? undefined,
      documentNumber: document?.documentNumber ?? undefined,
      batchNumber: document?.batchNumber ?? undefined,
      dateOfBirth: document?.dateOfBirth
        ? new Date(document?.dateOfBirth)
        : undefined,
      placeOfBirth: document?.placeOfBirth ?? undefined,
      placeOfIssue: document?.placeOfIssue ?? undefined,
      gender: document?.gender ?? undefined,
      nationality: document?.nationality ?? undefined,
      note: document?.note ?? undefined,
      images: document?.images?.map((img) => ({ url: img.url })) || [],
      additionalFields:
        document?.additionalFields?.map((field) => ({
          fieldName: field.fieldName,
          fieldValue: field.fieldValue,
        })) || [],
      issuanceDate: document?.issuanceDate
        ? new Date(document?.issuanceDate)
        : undefined,
      expiryDate: document?.expiryDate
        ? new Date(document?.expiryDate)
        : undefined,
      issuer: document?.issuer ?? undefined,
    },
    resolver: zodResolver(caseDocumentSchema),
  });
  const { updateCaseDocument } = useDocumentCaseApi();
  const { documentTypes, isLoading: isDocumentTypesLoading } =
    useDocumentTypes();
  const toast = useToast();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "additionalFields",
  });

  const onSubmit: SubmitHandler<CaseDocumentFormData> = async (data) => {
    try {
      await updateCaseDocument(documentCase.id, document!.id, data);
      // Extract document from the returned case
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toaster
            uniqueToastId={`toast-${id}`}
            variant="outline"
            title="Submitted"
            description="Document Updated succesfully"
            action="success"
          />
        ),
      });

      router.back();
    } catch (error) {
      const e = handleApiErrors<CaseDocumentFormData>(error);
      if ("detail" in e && e.detail) {
        toast.show({
          placement: "top",
          render: ({ id }) => (
            <Toaster
              uniqueToastId={`toast-${id}`}
              variant="outline"
              title="Failed updating document"
              description={e.detail}
              action="success"
            />
          ),
        });
      } else {
        Object.entries(e).forEach(([key, val]) =>
          form.setError(key as keyof CaseDocumentFormData, {
            message: val as string,
          })
        );
      }
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <VStack space="md">
        <CollapsibleFormSection title="Basic Information">
          <FormSelectInput
            controll={form.control}
            name="typeId"
            data={documentTypes.map((d) => ({ value: d.id, label: d.name }))}
            label="Document Type"
          />
        </CollapsibleFormSection>
        <CollapsibleFormSection title="Owner information">
          <FormTextInput
            controll={form.control}
            name="ownerName"
            label="Owner name"
            placeholder="e.g John Doe"
          />
          <FormDatePicker
            controll={form.control}
            name="dateOfBirth"
            label="Date of birth"
          />
          <FormSelectInput
            data={[
              { label: "Male", value: "Male" },
              { label: "Female", value: "Female" },
              { label: "Uknown", value: "Uknown" },
            ]}
            controll={form.control}
            name="gender"
            label="Gender"
          />
          <FormTextInput
            controll={form.control}
            name="nationality"
            label="Nationality"
            placeholder="e.g Kenyan"
          />
        </CollapsibleFormSection>
        <CollapsibleFormSection title="Document details">
          <FormTextInput
            controll={form.control}
            name="documentNumber"
            label="Document Id"
            placeholder="eg 12345677"
            helperText="Unique document id for the document like admission No, Passport No, e.t.c"
          />
          <FormTextInput
            controll={form.control}
            name="serialNumber"
            label="Serial Number"
            placeholder="Document serial number"
          />
          <FormTextInput
            controll={form.control}
            name="batchNumber"
            label="Batch Number"
            placeholder="Document Batch number"
          />
          <FormTextInput
            controll={form.control}
            name="issuer"
            label="Issuer"
            placeholder="Issuer or institution"
            helperText="e.g NTSA, Kenyyatta University"
          />
          <FormTextInput
            controll={form.control}
            name="placeOfIssue"
            label="Place of issue"
            placeholder="Where document was issued"
          />
          <FormDatePicker
            controll={form.control}
            name="issuanceDate"
            label="Date of issue"
          />
          <FormDatePicker
            controll={form.control}
            name="expiryDate"
            label="Date of Expiry"
          />
        </CollapsibleFormSection>
        <CollapsibleFormSection
          title="Custom Fields"
          actions={
            <Button
              size="xs"
              variant="outline"
              onPress={() => append({ fieldName: "", fieldValue: "" })}
            >
              <ButtonIcon as={Plus} />
              <ButtonText>Add Field</ButtonText>
            </Button>
          }
        >
          {fields.length === 0 ? (
            <Text className="text-typography-500 text-center py-4">
              No additional fields added. Click {'"Add Field"'} to add custom
              fields.
            </Text>
          ) : (
            <VStack space="md">
              {fields.map((field, index) => (
                <VStack key={field.id} className="items-END" space="sm">
                  <FormTextInput
                    controll={form.control}
                    name={`additionalFields.${index}.fieldName`}
                    label="Field Name"
                    placeholder="e.g Course"
                  />
                  <FormTextInput
                    controll={form.control}
                    name={`additionalFields.${index}.fieldValue`}
                    label="Field Value"
                    placeholder="e.g Bsc. IT"
                  />
                  <Button
                    variant="solid"
                    onPress={() => remove(index)}
                    aria-label="Remove field"
                    action="negative"
                    className="rounded-full"
                    size="xs"
                  >
                    <ButtonIcon
                      as={Trash}
                      size={18 as any}
                      className="text-white"
                    />
                    <ButtonText className="text-white">Remove field</ButtonText>
                  </Button>
                  <Divider className="my-6" />
                </VStack>
              ))}
            </VStack>
          )}
        </CollapsibleFormSection>

        <CollapsibleFormSection title="Additional notes">
          <FormTextArea
            controll={form.control}
            name="note"
            label="Notes"
            helperText="Any additional info about the document"
          />
        </CollapsibleFormSection>
        <Button
          disabled={form.formState.isSubmitting}
          className="bg-teal-500 rounded-full"
          onPress={form.handleSubmit(onSubmit)}
          size="xl"
        >
          {form.formState.isSubmitting && (
            <ButtonSpinner className="text-white" />
          )}
          <ButtonText className="text-white">Update document</ButtonText>
          <ButtonIcon as={ArrowRight} className="text-white" />
        </Button>
      </VStack>
    </ScrollView>
  );
};

export default EditDocumentCaseForm;
