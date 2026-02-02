import { Button } from "@/components/button";
import { DocumentScannerInput, ExtractionModal } from "@/components/cases";
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
import { useDocumentExtraction } from "@/hooks/useDocumentExtraction";
import { uploadFile } from "@/lib/api";
import { foundDocumentCaseSchema } from "@/lib/schemas";
import {
  DocumentCase,
  Extraction,
  FoundDocumentCaseFormData,
} from "@/types/cases";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import React, { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ScrollView } from "react-native";

const AddFoundDocumentCase = () => {
  const [scanned, setScanned] = useState<string[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const extractionRef = useRef<Extraction | undefined>(undefined);
  const [extractionModalVisible, setExtractionModalVisible] = useState(false);

  const toast = useToast();
  const form = useForm({
    defaultValues: {},
    resolver: zodResolver(foundDocumentCaseSchema),
  });
  const { addresses } = useAddresses();
  const { startExtraction } = useDocumentExtraction();

  const onSubmit: SubmitHandler<FoundDocumentCaseFormData> = async (data) => {
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
      setUploadingFiles(true);
      const uploads = await Promise.allSettled(
        scanned.map((uri) => uploadFile(uri))
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
      // Add Images to form data
      form.setValue(
        "images",
        uploads.filter((u) => u.status === "fulfilled").map((u) => u.value)
      );

      const extraction = await startExtraction();
      if (!extraction) {
        toast.show({
          placement: "top",
          render: ({ id }) => {
            const uniqueToastId = "toast-" + id;
            return (
              <Toaster
                uniqueToastId={uniqueToastId}
                variant="outline"
                title="Extraction failed"
                description={"Failed to start document extraction"}
                action="error"
              />
            );
          },
        });
        return;
      }
      extractionRef.current = extraction;
      setExtractionModalVisible(true);
    } catch (error: any) {
      setUploadingFiles(false);
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

  const onExtractionComplete = (docCase: DocumentCase) => {
    setExtractionModalVisible(false);
    router.push({
      pathname: "/document-case/[caseId]",
      params: { caseId: docCase.id },
    });
  };

  const onClose = ()=>{
    setExtractionModalVisible(false)
  }
  return (
    <ScreenLayout title="Report Found Document">
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack className="w-full items-center" space="sm">
          <DocumentScannerInput
            onScannedDocumentsChange={setScanned}
            maxNumDocuments={2}
          />
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
            loading={uploadingFiles}
          />
        </VStack>
      </ScrollView>
      {extractionModalVisible && !!extractionRef.current && (
        <ExtractionModal
          extraction={extractionRef.current}
          onExtractionComplete={onExtractionComplete}
          data={form.getValues() as FoundDocumentCaseFormData}
          onClose={onClose}
        />
      )}
    </ScreenLayout>
  );
};

export default AddFoundDocumentCase;
