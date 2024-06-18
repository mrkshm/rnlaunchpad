import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, View } from "react-native";
import * as v from "valibot";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { t, Trans } from "@lingui/macro";

import ErrorInlineDisplay from "~/components/error-inline-display";
import { SafeAreaView } from "~/components/safe-area-view";
import { Button } from "~/components/ui/button";
import { Form, FormField, FormInput } from "~/components/ui/form";
import { Text } from "~/components/ui/text";
import { H1, Muted } from "~/components/ui/typography";
import { useAuth } from "~/context/auth-provider";
import { useAnalytics } from "~/hooks/use-analytics";
import { reportError } from "~/lib/report-error";
import { ActivationSource } from "~/lib/schemas-and-types";

const formSchema = v.object({
  email: v.pipe(
    v.string(),
    v.nonEmpty(t`Please enter an email`),
    v.email(t`Please enter a valid email`)
  ),
});

export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const router = useRouter();
  const { trackEvent } = useAnalytics();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<v.InferOutput<typeof formSchema>>({
    resolver: valibotResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  trackEvent("User Viewed Reset Password Screen");

  async function onSubmit(data: v.InferOutput<typeof formSchema>) {
    setErrorMessage(null);
    setIsLoading(true);
    trackEvent("User Submitted Reset Password Form", { email: data.email });
    try {
      await resetPassword({ email: data.email });

      form.reset();
      trackEvent("User Reset Password Success", { email: data.email });
      router.push({
        pathname: "/(public)/confirm",
        params: { email: data.email, source: ActivationSource.PasswordChange },
      });
    } catch (error: Error | any) {
      reportError(error);
      setErrorMessage(
        t`An error occurred while trying to reset your password.
        Please check your information and try again.`
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background p-4">
      <View className="flex-1">
        <H1 className="self-start">{t`Reset Password`}</H1>
        <View className="self-start mb-5">
          <Trans>
            <Muted>You will receive an email with instructions</Muted>
            <Muted>on how to reset your password.</Muted>
          </Trans>
        </View>
        <Form {...form}>
          <View className="gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormInput
                  label={t`Email`}
                  placeholder={t`Email`}
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  keyboardType="email-address"
                  {...field}
                />
              )}
            />
          </View>
        </Form>
        {errorMessage && <ErrorInlineDisplay message={errorMessage} />}
      </View>
      <View className="gap-y-4">
        <Button
          size="default"
          variant="default"
          onPress={form.handleSubmit(onSubmit)}
        >
          {form.formState.isSubmitting ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text>{t`Reset Password`}</Text>
          )}
        </Button>
        <Muted
          className="text-center"
          onPress={() => {
            router.replace("/sign-in");
          }}
        >
          {t`Remember your password?`}{" "}
          <Muted className="text-foreground">
            {isLoading ? <ActivityIndicator size="small" /> : t`Sign in`}
          </Muted>
        </Muted>
      </View>
    </SafeAreaView>
  );
}
