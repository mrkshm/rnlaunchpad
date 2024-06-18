import { Link } from "expo-router";
import { t } from "@lingui/macro";
import { View } from "react-native";

import { Text } from "~/components/ui/text";
import { H1, Muted } from "~/components/ui/typography";
import { useAnalytics } from "~/hooks/use-analytics";

export default function NotFoundScreen() {
  const { trackEvent } = useAnalytics();
  trackEvent("User Viewed 404 Screen");
  return (
    <View className="flex flex-1 items-center justify-center bg-background p-4 gap-y-4">
      <H1 className="text-center">404</H1>
      <Muted className="text-center">{t`This screen does not exist.`}</Muted>
      <Link href="/">
        <Text>{t`Click to get back to the app`}</Text>
      </Link>
    </View>
  );
}
