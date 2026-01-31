import { Button } from "@/components/button";
import {
  DocumentScannerInput,
  ScannedDocumentChangeProps,
} from "@/components/cases";
import {
  FormDatePicker,
  FormSelectInput,
  FormTextArea,
} from "@/components/form-inputs";
import { ScreenLayout } from "@/components/layout";
import Toaster from "@/components/toaster";
import { useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { useAddresses } from "@/hooks/use-addresses";
import { foundDocumentCaseSchema } from "@/lib/schemas";
import { FoundDocumentCaseFormData } from "@/types/cases";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react-native";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ScrollView } from "react-native";

const AddFoundDocumentCase = () => {
  const [scanned, setScanned] = useState<
    ScannedDocumentChangeProps | undefined
  >();
  const toast = useToast();
  const form = useForm({
    defaultValues: {},
    resolver: zodResolver(foundDocumentCaseSchema),
  });
  const { addresses } = useAddresses();
  const onSubmit: SubmitHandler<FoundDocumentCaseFormData> = (data) => {
    try {
      if (!scanned) {
        toast.show({
          placement: "top",
          render: ({ id }) => {
            const uniqueToastId = "toast-" + id;
            return (
              <Toaster
                uniqueToastId={uniqueToastId}
                variant="outline"
                title="Failed to report found document"
                description={"No scanned document"}
                action="error"
              />
            );
          },
        });
        return;
      }
    } catch (error: any) {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          return (
            <Toaster
              uniqueToastId={uniqueToastId}
              variant="outline"
              title="Error"
              description={error?.message}
              action="error"
            />
          );
        },
      });
    }
  };
  return (
    <ScreenLayout title="Report Found Document">
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack className="w-full items-center" space="sm">
          <DocumentScannerInput onScannedDocumentsChange={setScanned} />
          <FormSelectInput
            controll={form.control}
            name="addressId"
            label="Address"
            helperText="Where you found the document"
            data={addresses.map((a) => ({
              label: a.label as string,
              value: a.id,
            }))}
          />
          <FormDatePicker
            controll={form.control}
            name="eventDate"
            label="Date found"
          />
          <FormTextArea
            controll={form.control}
            name="description"
            label="Description"
            placeholder="Describe here ..."
          />
          <Button
            text="Submit"
            suffixIcon={ArrowRight}
            onPress={form.handleSubmit(onSubmit)}
          />
        </VStack>
      </ScrollView>
    </ScreenLayout>
  );
};

export default AddFoundDocumentCase;
