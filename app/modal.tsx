import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Link } from "expo-router";

export default function ModalScreen() {
  return (
    <Box>
      <Text size="md">This is a modal</Text>
      <Link href="/" dismissTo>
        <Text>Go to home screen</Text>
      </Link>
    </Box>
  );
}
