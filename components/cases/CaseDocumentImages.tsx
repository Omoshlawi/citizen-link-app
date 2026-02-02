import { authClient } from "@/lib/auth-client";
import { BASE_URL } from "@/lib/constants";
import { DocumentImage } from "@/types/cases";
import { FileType } from "lucide-react-native";
import React, { FC, useMemo, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { Box } from "../ui/box";
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
  const selectedImage = useMemo(
    () => images[selectedIndex]?.url,
    [selectedIndex, images]
  );
  return (
    <VStack>
      <Box className="rounded-2xl overflow-hidden bg-background-0 dark:bg-background-btn shadow-sm border border-outline-100">
        <Box className="w-full aspect-[4/3] bg-background-50 items-center justify-center">
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
                No preview
              </Text>
            </VStack>
          )}
        </Box>
        <Box className="px-4 py-3 border-t border-outline-100">
          <Text className="text-xs text-typography-500 uppercase tracking-wide">
            {documentType}
          </Text>
        </Box>
      </Box>
      {/* Horizontal Thumbnail List */}
      {images.length > 0 && (
        <Box className="h-24">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingVertical: 4 }}
          >
            {images.map(({ url: uri }, i) => (
              <TouchableOpacity
                onPress={() => setSelectedIndex(i)}
                key={i}
                className="relative rounded-lg overflow-hidden border border-outline-200"
              >
                <Image
                  source={{
                    uri: `${BASE_URL}/api/files/stream?fileName=${uri}`,
                    headers: {
                      Authorization: `Bearer ${userSession?.session.token}`,
                    },
                  }}
                  className="w-16 h-20"
                  alt={`Page ${i + 1}`}
                />
                <Box className="absolute bottom-0 right-0 left-0 bg-background-900/60 items-center">
                  <Text className="text-[10px] text-white font-bold">
                    {i + 1}
                  </Text>
                </Box>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Box>
      )}
    </VStack>
  );
};

export default CaseDocumentImages;
