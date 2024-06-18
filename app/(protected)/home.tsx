import { Text, View } from "react-native";
import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";

import {
  H1,
  H2,
  H3,
  H4,
  BlockQuote,
  P,
  Muted,
  Code,
  Lead,
  Large,
  Small,
} from "~/components/ui/typography";

export function Home() {
  return (
    <View className="flex-1 gap-4 items-center justify-center">
      <H1>{t`Showcase, h1`}</H1>
      <H2>Typopraphy Types, h2</H2>
      <H3>One more Title, h3</H3>
      <H4>Last Title, h4</H4>
      <Large>Large Text</Large>
      <Small>Small Text</Small>
      <BlockQuote>Quoting with a Block Quote</BlockQuote>
      <Lead>Lead Text</Lead>
      <Muted>Muted Text</Muted>
      <Code>some code var = const + 1</Code>
      <P>Good old paragraph</P>
    </View>
  );
}

export default Home;
