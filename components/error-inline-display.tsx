import { t } from "@lingui/macro";
import { View } from "react-native";

import { P } from "~/components/ui/typography";
import { TriangleAlert } from "~/lib/icons/triangle-alert";

interface ErrorInlineDisplayProps {
  message?: string | null;
}

function ErrorInlineDisplay({ message }: ErrorInlineDisplayProps) {
  return message ? (
    <View className="flex-1 px-8 flex-row gap-4 items-center justify-center">
      <TriangleAlert size={24} color={"red"} />
      <P className="text-red-500">{message}</P>
    </View>
  ) : null;
}

export default ErrorInlineDisplay;
