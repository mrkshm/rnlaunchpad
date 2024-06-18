import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";

import { SafeAreaView } from "~/components/safe-area-view";
import { H1, P } from "~/components/ui/typography";
import { ArrowLeft } from "~/lib/icons/arrow-left";
const TermsAndConditions = () => {
  const router = useRouter();
  return (
    <View className="flex-1 p-4">
      <SafeAreaView>
        <Pressable onPress={() => router.navigate("/(public)/sign-up")}>
          <ArrowLeft className="text-foreground my-4" />
        </Pressable>
        <H1>TermsAndConditions</H1>
        <P>The usual boilerplate</P>
      </SafeAreaView>
    </View>
  );
};

export default TermsAndConditions;
