import * as React from "react";
import { View, SafeAreaView, ScrollView } from "react-native";

import { H1, P } from "~/components/ui/typography";
import { useAnalytics } from "~/hooks/use-analytics";
import RickCard from "~/components/rick-card";
import AnalyticsAndErrorTester from "~/components/analytics-and-error-tester";

export default function Screen() {
  const { trackEvent } = useAnalytics();
  trackEvent("User Viewed Welcome Screen");

  return (
    <SafeAreaView className="flex-1">
      <ScrollView>
        <View className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
          <H1>Welcome to SupaStarter</H1>
          <P>An template to help you build a great React Native app.</P>
          <AnalyticsAndErrorTester />
          <RickCard />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
