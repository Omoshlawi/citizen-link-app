import { DocumentImage } from "@/types/cases";
import { Eye, EyeOff } from "lucide-react-native";
import React, { FC, useMemo, useState } from "react";
import { ProtectedImages } from "../image";
import { Box } from "../ui/box";
import { Button, ButtonIcon } from "../ui/button";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";

type CaseDocumentImagesProps = {
  documentType: string;
  images?: DocumentImage[];
};
const CaseDocumentImages: FC<CaseDocumentImagesProps> = ({
  documentType,
  images: _images = [],
}) => {
  const [blured, setBlured] = useState(true);
  const images = useMemo(() => {
    return _images
      .map((at) => {
        if (blured) {
          return at?.blurredUrl;
        }
        return at?.url;
      })
      .filter((at) => at) as string[];
  }, [_images, blured]);

  return (
    <Box className="rounded-2xl overflow-hidden bg-background-0 dark:bg-background-btn shadow-sm border border-outline-100">
      <ProtectedImages images={images} alt={`${documentType} front`} />
      <Box className="px-4 py-3 border-t border-outline-100">
        <HStack className="justify-between items-center">
          <Text className="text-xl font-bold text-typography-500 uppercase tracking-wide ">
            {documentType}
          </Text>
          <Button
            className="bg-teal-300 dark:bg-teal-700"
            onPress={() => setBlured((bl) => !bl)}
            size="xs"
          >
            <ButtonIcon
              as={blured ? Eye : EyeOff}
              size="xs"
              className="text-white"
            />
          </Button>
        </HStack>
      </Box>
    </Box>
  );
};

export default CaseDocumentImages;
