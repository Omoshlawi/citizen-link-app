import Color from "color";
import { ChevronLeft, ChevronRight, FileType } from "lucide-react-native";
import React, { FC, useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { authClient } from "@/lib/auth-client";
import { BASE_URL } from "@/lib/constants";
import {
  getMatchRecommendationDisplay,
  getMatchStatusColor,
  getMatchStatusDisplay,
} from "@/lib/helpers";
import { Match } from "@/types/matches";

import { Box } from "../ui/box";
import { Icon } from "../ui/icon";
import { Image } from "../ui/image";

type MatchImagePreviewProps = {
  match: Match;
  onPress?: (match: Match) => void;
};

const MatchImagePreview: FC<MatchImagePreviewProps> = ({ match, onPress }) => {
  const { data: userSession } = authClient.useSession();
  const [index, setIndex] = useState(0);

  const images = useMemo(
    () => match?.foundDocumentCase?.case?.document?.images ?? [],
    [match],
  );
  const currentImage = images[index]?.blurredUrl;

  const navigate = (direction: number) => {
    setIndex((prev) => (prev + direction + images.length) % images.length);
  };

  const imageSource = {
    uri: `${BASE_URL}/api/files/stream?fileName=${currentImage}`,
    headers: { Authorization: `Bearer ${userSession?.session?.token}` },
  };

  const statusColor = getMatchStatusColor(match.status);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress?.(match)}
      className=""
    >
      <Box className="w-full">
        {/* Main Image Area */}
        <Box className="w-full aspect-[4/3] items-center justify-center relative">
          {currentImage ? (
            <Image
              source={imageSource}
              alt="Doc"
              className="w-full h-full"
              resizeMode="contain"
            />
          ) : (
            <Icon as={FileType} size="xl" className="opacity-20" />
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

        {/* Content Area */}
        <Box className="mt-2">
          <View className="flex-row justify-between items-start mb-2">
            <View>
              <Text className="text-xs text-typography-400 font-bold uppercase">
                Match #{match.matchNumber}
              </Text>
              <Text className="text-lg font-bold text-typography-900">
                {match.matchScore}% Match
              </Text>
            </View>
            <View
              style={{
                backgroundColor: Color(statusColor).alpha(0.1).toString(),
              }}
              className="px-3 py-1 rounded-full"
            >
              <Text
                style={{ color: statusColor }}
                className="text-[10px] font-bold uppercase"
              >
                {getMatchStatusDisplay(match.status)}
              </Text>
            </View>
          </View>

          <Text
            className="text-sm text-typography-500 italic"
            numberOfLines={2}
          >
            {getMatchRecommendationDisplay(match.aiAnalysis.recommendation)}
          </Text>
        </Box>
      </Box>
    </TouchableOpacity>
  );
};

export default MatchImagePreview;
