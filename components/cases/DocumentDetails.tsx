import { Document } from "@/types/cases";
import dayjs from "dayjs";
import {
  Building,
  Calendar,
  CircleSmall,
  FileType,
  Hash,
  Info,
  MapPin,
  Origami,
} from "lucide-react-native";
import React, { FC } from "react";
import { Text } from "react-native";
import { DisplayTile } from "../list-tile";
import { Box } from "../ui/box";
import { VStack } from "../ui/vstack";

type DocumentDetailsProps = {
  document: Document;
};

const DocumentDetails: FC<DocumentDetailsProps> = ({ document }) => {
  const dateFomart = "DD MMMM YYYY";
  const additionalFields = document.additionalFields ?? [];

  return (
    <VStack className=" pt-6" space="md">
      <Text className="text-sm font-semibold text-typography-800">
        Document Details
      </Text>
      <Box className="rounded-xl bg-background-0 dark:bg-background-btn border border-outline-100 overflow-hidden">
        <VStack className="px-4" space="xs">
          <DisplayTile
            icon={FileType}
            label="Document Type"
            value={document.type.name}
            hideIfNoValue
          />
          <DisplayTile
            icon={Building}
            label="Institution / Issuer"
            value={document.issuer}
            withTopOutline
          />
          <DisplayTile
            icon={Calendar}
            label="Date of Issue"
            value={
              dayjs(document.issuanceDate).isValid()
                ? dayjs(document.issuanceDate).format(dateFomart)
                : undefined
            }
            withTopOutline
            hideIfNoValue
          />
          <DisplayTile
            icon={MapPin}
            label="Place of Issue"
            value={document.placeOfIssue}
            withTopOutline
            hideIfNoValue
          />
          <DisplayTile
            icon={Hash}
            label="Batch Number"
            value={document.batchNumber}
            withTopOutline
            hideIfNoValue
          />
          <DisplayTile
            icon={CircleSmall}
            label="Gender"
            value={document.gender}
            withTopOutline
            hideIfNoValue
          />
          <DisplayTile
            icon={Origami}
            label="Nationality"
            value={document.nationality}
            withTopOutline
            hideIfNoValue
          />
          <DisplayTile
            icon={Calendar}
            label="Expiry Date"
            value={
              dayjs(document.expiryDate).isValid()
                ? dayjs(document.expiryDate).format(dateFomart)
                : undefined
            }
            withTopOutline
            hideIfNoValue
          />
          <DisplayTile
            icon={Calendar}
            label="Date of birth"
            value={
              dayjs(document.dateOfBirth).isValid()
                ? dayjs(document.dateOfBirth).format(dateFomart)
                : undefined
            }
            hideIfNoValue
            withTopOutline
          />
          <DisplayTile
            icon={MapPin}
            label="Place of birth"
            value={document.placeOfBirth}
            withTopOutline
            hideIfNoValue
          />

          {additionalFields.map((f, i) => (
            <DisplayTile
              withTopOutline
              key={i}
              icon={Info}
              label={f.fieldName}
              value={f.fieldValue}
            />
          ))}
        </VStack>
      </Box>
    </VStack>
  );
};

export default DocumentDetails;
