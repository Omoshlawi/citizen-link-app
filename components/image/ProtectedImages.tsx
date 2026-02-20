import { authClient } from "@/lib/auth-client";
import { BASE_URL } from "@/lib/constants";
import { ChevronLeft, ChevronRight, File } from "lucide-react-native";
import React, { FC, useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Box } from "../ui/box";
import { Icon } from "../ui/icon";
import { Image } from "../ui/image";
import { VStack } from "../ui/vstack";

type ProtectedImagesProps = {
  images?: string[];
  alt?: string;
};
const ProtectedImages: FC<ProtectedImagesProps> = ({
  images = [],
  alt = "No preview",
}) => {
  const { data: userSession } = authClient.useSession();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = useMemo(() => {
    const img = images[selectedIndex];
    return img;
  }, [selectedIndex, images]);
  const navigate = (direction: number) => {
    setSelectedIndex(
      (prev) => (prev + direction + images.length) % images.length,
    );
  };
  return (
    <Box className="w-full aspect-[4/3] items-center justify-center">
      {selectedImage ? (
        <Image
          source={{
            uri: `${BASE_URL}/api/files/stream?fileName=${selectedImage}`,
            headers: {
              Authorization: `Bearer ${userSession?.session.token}`,
            },
          }}
          alt={`Attachment ${selectedIndex + 1}`}
          className="w-full h-full"
          resizeMode="contain"
        />
      ) : (
        <VStack className="items-center justify-center flex-1 px-6">
          <Icon as={File} size="lg" className="text-typography-300 mb-2" />
          <Text className="text-typography-400 text-sm text-center">{alt}</Text>
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
  );
};

export default ProtectedImages;
