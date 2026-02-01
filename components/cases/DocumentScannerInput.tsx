import { ScanText, Trash2 } from "lucide-react-native";
import React, { FC, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import DocumentScanner from "react-native-document-scanner-plugin";
import Toaster from "../toaster";
import { Box } from "../ui/box";
import { Icon } from "../ui/icon";
import { Image } from "../ui/image";
import { Text } from "../ui/text";
import { useToast } from "../ui/toast";
import { VStack } from "../ui/vstack";

type DocumentScannerInputProps = {
  onScannedDocumentsChange: (props: string[]) => void;
  maxNumDocuments?: number;
};

const DocumentScannerInput: FC<DocumentScannerInputProps> = ({
  onScannedDocumentsChange,
  maxNumDocuments,
}) => {
  const [documents, setDocuments] = useState<string[]>([]);
  const toast = useToast();

  const scanDocument = async () => {
    try {
      const scanResult = await DocumentScanner.scanDocument({
        maxNumDocuments: maxNumDocuments,
      });
      const scannedImages = scanResult.scannedImages;

      if (!scannedImages?.length) {
        toast.show({
          placement: "top",
          render: ({ id }) => (
            <Toaster
              uniqueToastId={"toast-" + id}
              variant="outline"
              title="Cancelled"
              description="No images were scanned"
              action="warning"
            />
          ),
        });
        return;
      }

      const updatedDocs = [...documents, ...scannedImages];
      onScannedDocumentsChange(updatedDocs);
      setDocuments(updatedDocs);
    } catch (error: any) {
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toaster
            uniqueToastId={"toast-" + id}
            variant="outline"
            title="Scan Error"
            description={error?.message || "Check camera permissions"}
            action="error"
          />
        ),
      });
    }
  };

  const removeImage = (index: number) => {
    const filtered = documents.filter((_, i) => i !== index);
    setDocuments(filtered);
    onScannedDocumentsChange(filtered);
  };

  return (
    <VStack className="w-full" space="md">
      {/* Dropzone Style Scan Button */}
      <TouchableOpacity
        onPress={scanDocument}
        className="relative items-center justify-center w-full h-40 rounded-2xl border-2 border-dashed border-outline-300 bg-background-50 dark:bg-background-btn gap-2"
        activeOpacity={0.6}
      >
        <Box className="bg-primary-100 p-4 rounded-full">
          <Icon as={ScanText} size="xl" className="text-primary-600" />
        </Box>
        <VStack className="items-center">
          <Text className="text-typography-900 font-bold">
            {documents.length > 0 ? "Add More Pages" : "Scan Document"}
          </Text>
          <Text size="xs" className="text-typography-500">
            {documents.length} pages scanned
          </Text>
        </VStack>
      </TouchableOpacity>

      {/* Horizontal Thumbnail List */}
      {documents.length > 0 && (
        <Box className="h-24">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingVertical: 4 }}
          >
            {documents.map((uri, i) => (
              <Box
                key={i}
                className="relative rounded-lg overflow-hidden border border-outline-200"
              >
                <Image
                  source={{ uri }}
                  className="w-16 h-20"
                  alt={`Page ${i + 1}`}
                />
                <Box className="absolute bottom-0 right-0 left-0 bg-background-900/60 items-center">
                  <Text className="text-[10px] text-white font-bold">
                    {i + 1}
                  </Text>
                </Box>
                <TouchableOpacity
                  className="absolute top-1 right-1 bg-error-500 rounded-full p-1"
                  onPress={() => removeImage(i)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Icon as={Trash2} className="text-white" size="xs" />
                </TouchableOpacity>
              </Box>
            ))}
          </ScrollView>
        </Box>
      )}
    </VStack>
  );
};

export default DocumentScannerInput;
