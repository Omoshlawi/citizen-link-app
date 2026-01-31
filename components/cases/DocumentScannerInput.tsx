import { ScanText } from "lucide-react-native";
import React, { FC, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import RNBlobUtil from "react-native-blob-util";
import DocumentScanner from "react-native-document-scanner-plugin";
import { createPdf } from "react-native-images-to-pdf";
import Toaster from "../toaster";
import { Icon } from "../ui/icon";
import { Image } from "../ui/image";
import { Text } from "../ui/text";
import { useToast } from "../ui/toast";
export type ScannedDocumentChangeProps = {
  thumbnail: string;
  document: string;
};
type DocumentScannerInputProps = {
  onScannedDocumentsChange: (props: ScannedDocumentChangeProps) => void;
};

const DocumentScannerInput: FC<DocumentScannerInputProps> = ({
  onScannedDocumentsChange,
}) => {
  const [thumbnail, setThumbnail] = useState<string | undefined>();
  const toast = useToast();
  const scanDocument = async () => {
    try {
      const scanResult = await DocumentScanner.scanDocument();
      const scannedImages = scanResult.scannedImages;
      if (!scannedImages?.length) {
        toast.show({
          placement: "top",
          render: ({ id }) => {
            const uniqueToastId = "toast-" + id;
            return (
              <Toaster
                uniqueToastId={uniqueToastId}
                variant="outline"
                title="Warning"
                description={"No Scanned Imaged"}
                action="warning"
              />
            );
          },
        });
        // throw new Error("No images scanned");
        return;
      }
      const outputPath = `file://${RNBlobUtil.fs.dirs.DocumentDir}/scanned-documents.pdf`;
      const pdfPath = await createPdf({
        pages: scannedImages.map((imagePath) => ({ imagePath })),
        outputPath,
      });
      console.log(`PDF created successfully at: ${pdfPath}`);
      onScannedDocumentsChange({
        thumbnail: scannedImages[0],
        document: outputPath,
      });
      setThumbnail(scannedImages[0]);
    } catch (error: any) {
      console.error("Failed to create PDF:", error);
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          return (
            <Toaster
              uniqueToastId={uniqueToastId}
              variant="outline"
              title="Failed to create PDF"
              description={error?.nessage}
              action="error"
            />
          );
        },
      });
    }
  };
  return (
    <TouchableOpacity
      onPress={scanDocument}
      className="relative items-center justify-center w-40 h-40 rounded-full bg-background-btn overflow-hidden gap-3"
      activeOpacity={0.7}
    >
      {/* Thumbnail Layer */}
      {!!thumbnail && (
        <View className="absolute inset-0">
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full"
            resizeMode="cover"
          />
          {/* Dark Overlay for Text Contrast */}
          <View className="absolute inset-0 bg-black/45" pointerEvents="none" />
        </View>
      )}

      {/* Content Layer */}
      <Icon as={ScanText} size={60 as any} className="text-white" />
      <Text className="text-white font-bold text-center">Scan Document</Text>
    </TouchableOpacity>
  );
};

export default DocumentScannerInput;
