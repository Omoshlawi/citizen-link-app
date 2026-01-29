/**
 * Example usage of PinInput component
 * This file demonstrates various configurations
 */

import React, { useState } from "react";
import { Box } from "../box";
import { Text } from "../text";
import { VStack } from "../vstack";
import { Button, ButtonText } from "../button";
import PinInput from "./index";

export function PinInputExamples() {
  const [pin1, setPin1] = useState("");
  const [pin2, setPin2] = useState("");
  const [pin3, setPin3] = useState("");
  const [pin4, setPin4] = useState("");

  return (
    <VStack space="xl" className="p-4">
      {/* Basic 4-digit PIN with obscuring */}
      <Box>
        <Text className="text-lg font-bold mb-2">Basic 4-digit PIN</Text>
        <PinInput
          value={pin1}
          onChangeText={setPin1}
          onComplete={(value) => {
            console.log("PIN complete:", value);
          }}
          length={4}
          obscureText={true}
        />
        <Text className="text-sm text-typography-500 mt-2">
          Value: {pin1 || "empty"}
        </Text>
      </Box>

      {/* 6-digit PIN without obscuring */}
      <Box>
        <Text className="text-lg font-bold mb-2">6-digit PIN (visible)</Text>
        <PinInput
          value={pin2}
          onChangeText={setPin2}
          length={6}
          obscureText={false}
          size="lg"
        />
        <Text className="text-sm text-typography-500 mt-2">
          Value: {pin2 || "empty"}
        </Text>
      </Box>

      {/* Small size with filled variant */}
      <Box>
        <Text className="text-lg font-bold mb-2">Small filled variant</Text>
        <PinInput
          value={pin3}
          onChangeText={setPin3}
          length={4}
          size="sm"
          variant="filled"
          obscureText={true}
        />
        <Text className="text-sm text-typography-500 mt-2">
          Value: {pin3 || "empty"}
        </Text>
      </Box>

      {/* Underlined variant with error state */}
      <Box>
        <Text className="text-lg font-bold mb-2">Underlined with error</Text>
        <PinInput
          value={pin4}
          onChangeText={setPin4}
          length={4}
          variant="underlined"
          isInvalid={pin4.length === 4 && pin4 !== "1234"}
          obscureText={true}
        />
        <Text className="text-sm text-typography-500 mt-2">
          Value: {pin4 || "empty"}
        </Text>
        {pin4.length === 4 && pin4 !== "1234" && (
          <Text className="text-sm text-error-500 mt-1">
            Incorrect PIN. Try "1234"
          </Text>
        )}
      </Box>
    </VStack>
  );
}

