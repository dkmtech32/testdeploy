import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  VStack,
  HStack,
} from "@chakra-ui/react";

interface TrainingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (companionNumber: number, note: string) => void;
  title: string;
  message: string;
}

export const TrainingConfirmationModal: React.FC<TrainingConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  const [companionNumber, setCompanionNumber] = useState<number>(0);
  const [note, setNote] = useState<string>("");

  const handleConfirm = () => {
    onConfirm(companionNumber, note);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="gray.50" borderRadius="lg">
        <ModalHeader color="blue.600">{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={4}>{message}</Text>
          <VStack spacing={6} align="stretch">
            <FormControl>
              <FormLabel color="blue.600">Number of Companions</FormLabel>
              <HStack spacing={4}>
                <Slider
                  flex="1"
                  min={0}
                  max={4}
                  step={1}
                  value={companionNumber}
                  onChange={(value) => setCompanionNumber(value)}
                  colorScheme="blue"
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb boxSize={6} />
                </Slider>
                <Text fontWeight="bold" minWidth="1.5rem">
                  {companionNumber}
                </Text>
              </HStack>
            </FormControl>
            <FormControl>
              <FormLabel color="blue.600">Note</FormLabel>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add any additional information..."
                bg="white"
                borderColor="blue.200"
                _hover={{ borderColor: "blue.300" }}
                _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #3182ce" }}
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleConfirm}>
            Confirm
          </Button>
          <Button variant="outline" colorScheme="blue" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};