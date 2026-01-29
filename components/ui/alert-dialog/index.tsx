import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import React from "react";

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  variant?: "default" | "destructive";
}

export function AlertDialog({
  isOpen,
  onClose,
  title,
  message,
  confirmText = "OK",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "default",
}: AlertDialogProps) {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <VStack space="xs">
            <Heading size="lg">{title}</Heading>
          </VStack>
        </ModalHeader>
        <ModalBody>
          <Text size="md">{message}</Text>
        </ModalBody>
        <ModalFooter>
          <HStack space="md" className="w-full">
            {onCancel && (
              <Button
                variant="outline"
                onPress={handleCancel}
                className="flex-1"
              >
                <ButtonText>{cancelText}</ButtonText>
              </Button>
            )}
            <Button
              action={variant === "destructive" ? "negative" : "primary"}
              onPress={handleConfirm}
              className={onCancel ? "flex-1" : "w-full"}
            >
              <ButtonText>{confirmText}</ButtonText>
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
