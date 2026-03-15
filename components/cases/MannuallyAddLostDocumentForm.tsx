import { useDocumentCaseApi } from "@/hooks/use-document-cases";
import { useDocumentTypes } from "@/hooks/use-document-types";
import { handleApiErrors } from "@/lib/api";
import { lostDocumentCaseSchema } from "@/lib/schemas";
import { LostDocumentCaseFormData } from "@/types/cases";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { ArrowRight, Plus, Trash } from "lucide-react-native";
import React from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import {
  CollapsibleFormSection,
  FormCheckBox,
  FormDatePicker,
  FormSelectInput,
  FormTextArea,
  FormTextInput,
} from "../form-inputs";
import { KeyboardAvoidingLayout } from "../layout";
import { FormAddressPicker } from "../settings";
import Toaster from "../toaster";
import { Box } from "../ui/box";
import { Button, ButtonIcon, ButtonSpinner, ButtonText } from "../ui/button";
import { Divider } from "../ui/divider";
import { Text } from "../ui/text";
import { useToast } from "../ui/toast";
import { VStack } from "../ui/vstack";

const MannuallyAddLostDocumentForm = () => {
  const form = useForm({
    defaultValues: {
      additionalFields: [],
    },
    resolver: zodResolver(lostDocumentCaseSchema),
  });

  const { documentTypes } = useDocumentTypes();
  const { createLostDocumentCase } = useDocumentCaseApi();
  const toast = useToast();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "additionalFields",
  });
  const {
    fields: addressComponents,
    append: appendAddressComponent,
    remove: removeAddressComponent,
  } = useFieldArray({
    control: form.control,
    name: "addressComponents",
  });

  const onSubmit: SubmitHandler<LostDocumentCaseFormData> = async (data) => {
    try {
      const doc = await createLostDocumentCase(data);
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toaster
            uniqueToastId={`toast-${id}`}
            variant="outline"
            title="Submitted"
            description="Document case reported succesfully"
            action="success"
          />
        ),
      });
      router.replace({
        pathname: "/document-case/[caseId]",
        params: { caseId: doc.id },
      });
    } catch (error) {
      const e = handleApiErrors<LostDocumentCaseFormData>(error);
      if ("detail" in e && e.detail) {
        toast.show({
          placement: "top",
          render: ({ id }) => (
            <Toaster
              uniqueToastId={`toast-${id}`}
              variant="outline"
              title="Erro reporting lost document"
              description={e.detail}
              action="success"
            />
          ),
        });
      } else {
        Object.entries(e).forEach(([key, val]) =>
          form.setError(key as keyof LostDocumentCaseFormData, {
            message: val as string,
          }),
        );
      }
    }
  };

  return (
    <Box className="flex flex-1 w-full">
      <KeyboardAvoidingLayout>
        <VStack className="w-full items-center" space="sm">
          <CollapsibleFormSection title="Basic Information">
            <FormSelectInput
              controll={form.control}
              name="typeId"
              data={documentTypes.map((d) => ({ value: d.id, label: d.name }))}
              label="Document Type"
            />
            <FormAddressPicker
              controll={form.control}
              name="addressId"
              label="Address"
              helperText="Where you lost the document"
            />
            <FormDatePicker
              controll={form.control}
              name="eventDate"
              label="Date Lost"
            />
            <FormTextArea
              controll={form.control}
              name="description"
              label="Description"
              placeholder="Describe here ..."
            />
          </CollapsibleFormSection>
          <CollapsibleFormSection title="Owner information">
            <FormTextInput
              controll={form.control}
              name="surname"
              label="Surname"
              placeholder="e.g Doe"
            />
            <FormTextInput
              controll={form.control}
              name="givenNames"
              label="Given names"
              placeholder="e.g John"
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
            title="Address"
            defaultCollapsed
            actions={
              <Button
                size="xs"
                variant="outline"
                onPress={() => appendAddressComponent({ type: "", value: "" })}
              >
                <ButtonIcon as={Plus} />
                <ButtonText>Add Address Component</ButtonText>
              </Button>
            }
          >
            {addressComponents.length === 0 ? (
              <Text className="text-typography-500 text-center py-4">
                No address components added. Click {'"Add Address Component"'}{" "}
                to add address components.
              </Text>
            ) : (
              <VStack space="md">
                {addressComponents.map((component, index) => (
                  <VStack key={component.id} space="sm">
                    <FormTextInput
                      controll={form.control}
                      name={`addressComponents.${index}.type`}
                      label="Type"
                      helperText="Address component type e.g County"
                    />
                    <FormTextInput
                      controll={form.control}
                      name={`addressComponents.${index}.value`}
                      label="Value"
                      helperText="Address component value e.g Nairobi"
                    />
                    <Button
                      variant="outline"
                      onPress={() => removeAddressComponent(index)}
                      aria-label="Remove address component"
                      action="negative"
                      className="rounded-full"
                    >
                      <ButtonIcon as={Trash} className="text-error-500" />
                      <ButtonText className="text-error-500">Remove</ButtonText>
                    </Button>
                    {index < addressComponents.length - 1 && (
                      <Divider className="my-6" />
                    )}
                  </VStack>
                ))}
              </VStack>
            )}
          </CollapsibleFormSection>
          <CollapsibleFormSection title="Document Biometrics" defaultCollapsed>
            <VStack space="md">
              <FormCheckBox
                controll={form.control}
                name="fingerprintPresent"
                label="Fingerprint Present"
              />
              <FormCheckBox
                controll={form.control}
                name="photoPresent"
                label="Photo Present"
              />
              <FormCheckBox
                controll={form.control}
                name="signaturePresent"
                label="Signature Present"
              />
            </VStack>
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
                      <ButtonText className="text-white">
                        Remove field
                      </ButtonText>
                    </Button>
                    {index < fields.length - 1 && <Divider className="my-6" />}
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
            className="bg-teal-500 rounded-full w-full"
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
      </KeyboardAvoidingLayout>
    </Box>
  );
};

export default MannuallyAddLostDocumentForm;
