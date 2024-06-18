import { useRouter, useLocalSearchParams } from "expo-router";
import { t } from "@lingui/macro";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Pressable, View } from "react-native";
import * as v from "valibot";
import { valibotResolver } from "@hookform/resolvers/valibot";

import ErrorInlineDisplay from "~/components/error-inline-display";
import { SafeAreaView } from "~/components/safe-area-view";
import { Button } from "~/components/ui/button";
import { Form, FormField, FormInput } from "~/components/ui/form";
import { Text } from "~/components/ui/text";
import { H1, Muted } from "~/components/ui/typography";
import { useAuth } from "~/context/auth-provider";
import { useAnalytics } from "~/hooks/use-analytics";
import { getRedirectUrlAndVerificationType } from "~/lib/little-helpers";
import { notifyUser } from "~/lib/notify-user";
import { reportError } from "~/lib/report-error";

const formSchema = v.object({
  token: v.pipe(
    v.string(),
    v.nonEmpty(t`Please enter the validation code`),
    v.minLength(6, t`Your code is not complete, please enter all six numbers`),
    v.maxLength(6, t`Your code is too long, please enter 6 numbers`)
  ),
});

export default function Confirm() {
  const { verifyOtp, setIsVerifyingOtp } = useAuth();
  const { trackEvent } = useAnalytics();
  const router = useRouter();
  const { email, source } = useLocalSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  trackEvent("User Viewed Confirm Screen");

  const [redirectUrl, verificationType] =
    getRedirectUrlAndVerificationType(source);

  const form = useForm<v.InferOutput<typeof formSchema>>({
    resolver: valibotResolver(formSchema),
    defaultValues: {
      token: "",
    },
  });

  function handleTryAgain() {
    setIsVerifyingOtp?.(false);
    router.replace("/(public)/sign-up");
  }
  async function onSubmit(data: v.InferOutput<typeof formSchema>) {
    setErrorMessage(null);
    setIsLoading(true);
    trackEvent("User Submitted Confirm Form", {
      email,
      source,
      verificationType,
    });
    if (!email || typeof email !== "string") {
      setErrorMessage(t`We could not associate an email address with this request.
        Please try again or contact support.`);
      return;
    }
    try {
      await verifyOtp({ token: data.token, email, type: verificationType });
      if (verificationType === "email_change") {
        notifyUser({
          title: t`Success`,
          message: t`Your email has been changed successfully.`,
        });
      }
      trackEvent("User OTP Confirm Success", {
        email,
        source,
        verificationType,
      });
      router.replace(redirectUrl);
      form.reset();
    } catch (error: Error | any) {
      reportError(error);
      setErrorMessage(
        t`Something went wrong. Please double-check your code and try again.`
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background p-4">
      <View className="flex-1">
        <H1 className="self-start">{t`Activate your account`}</H1>
        <Muted className="self-start mb-5">
          {t`to continue to Expo Supabase Starter`}
        </Muted>
        <Form {...form}>
          <View className="gap-4">
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormInput
                  label={t`Activation Code`}
                  placeholder="123456"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="number-pad"
                  {...field}
                />
              )}
            />
          </View>
        </Form>
      </View>
      {errorMessage && <ErrorInlineDisplay message={errorMessage} />}
      <View className="gap-y-4">
        <Button
          size="default"
          variant="default"
          onPress={form.handleSubmit(onSubmit)}
        >
          {isLoading ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text>{t`Activate your account`}</Text>
          )}
        </Button>
        <Muted
          className="text-center"
          onPress={() => {
            router.replace("/(public)/sign-up");
          }}
        >
          {t`If you have not received an email, please check you spam folder. You can also `}
          <Pressable className="-mb-1 pl-1" onPress={handleTryAgain}>
            <Muted className="text-foreground pt-1">{t`try again`}</Muted>
          </Pressable>
        </Muted>
      </View>
    </SafeAreaView>
  );
}
