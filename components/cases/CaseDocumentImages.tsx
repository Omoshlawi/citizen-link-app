import { authClient } from "@/lib/auth-client";
import { BASE_URL } from "@/lib/constants";
import { DocumentImage } from "@/types/cases";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  FileType,
} from "lucide-react-native";
import React, { FC, useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Box } from "../ui/box";
import { Button, ButtonIcon } from "../ui/button";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
import { Image } from "../ui/image";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

type CaseDocumentImagesProps = {
  documentType: string;
  images?: DocumentImage[];
};
const CaseDocumentImages: FC<CaseDocumentImagesProps> = ({
  documentType,
  images = [],
}) => {
  const { data: userSession } = authClient.useSession();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [blured, setBlured] = useState(true);
  const selectedImage = useMemo(() => {
    const img = images[selectedIndex];
    if (blured) return img?.blurredUrl;
    return img.url;
  }, [selectedIndex, images, blured]);
  const navigate = (direction: number) => {
    setSelectedIndex(
      (prev) => (prev + direction + images.length) % images.length,
    );
  };
  return (
    <Box className="rounded-2xl overflow-hidden bg-background-0 dark:bg-background-btn shadow-sm border border-outline-100">
      <Box className="w-full aspect-[4/3] items-center justify-center">
        {selectedImage ? (
          <Image
            source={{
              uri: `${BASE_URL}/api/files/stream?fileName=${selectedImage}`,
              headers: {
                Authorization: `Bearer ${userSession?.session.token}`,
              },
            }}
            alt={`${documentType} front`}
            className="w-full h-full"
            resizeMode="contain"
          />
        ) : (
          <VStack className="items-center justify-center flex-1 px-6">
            <Icon
              as={FileType}
              size="lg"
              className="text-typography-300 mb-2"
            />
            <Text className="text-typography-400 text-sm text-center">
              {blured ? "No blured Preview" : "No preview"}
            </Text>
          </VStack>
        )}
        {/* Minimalist Navigation Arrows */}
        {images.length > 1 && (
          <View className="absolute inset-x-0 flex-row justify-between px-2">
            <TouchableOpacity
              onPress={() => navigate(-1)}
              className="p-2 bg-black/20 rounded-full"
            >
              <Icon as={ChevronLeft} className="text-white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigate(1)}
              className="p-2 bg-black/20 rounded-full"
            >
              <Icon as={ChevronRight} className="text-white" />
            </TouchableOpacity>
          </View>
        )}
      </Box>
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
