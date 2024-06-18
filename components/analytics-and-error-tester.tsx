import { View, Text } from "react-native";
import { t } from "@lingui/macro";

import { Button } from "~/components/ui/button";
import { P } from "~/components/ui/typography";
import { useAnalytics } from "~/hooks/use-analytics";
import { reportError } from "~/lib/report-error";

const AnalyticsAndErrorTester = () => {
  const { trackEvent } = useAnalytics();
  return (
    <View>
      <P>
        {t`Two Buttons to test Error Reporting (Bugsnag or log to console) and Analytics (Mixpanel or log to console). You should probably delete this component after making sure that everything works as expected.`}
      </P>
      <Button
        variant="secondary"
        onPress={() => {
          reportError(new Error("Test error"));
        }}
      >
        <Text className="text-foreground">{t`Throw an Error for Testing`}</Text>
      </Button>
      <Button
        className="pt-4"
        variant="secondary"
        onPress={() => {
          trackEvent("Button Clicked", {
            buttonName: "Select Premium Plan",
          });
        }}
      >
        <Text className="text-foreground">{t`Log an Event for Testing`}</Text>
      </Button>
    </View>
  );
};

export default AnalyticsAndErrorTester;
