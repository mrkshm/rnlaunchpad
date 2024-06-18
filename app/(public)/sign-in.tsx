import { Link, useRouter } from "expo-router";
import { t } from "@lingui/macro";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Text, View } from "react-native";
import * as v from "valibot";
import { valibotResolver } from "@hookform/resolvers/valibot";

import ErrorInlineDisplay from "~/components/error-inline-display";
import { SafeAreaView } from "~/components/safe-area-view";
import { Button } from "~/components/ui/button";
import { Form, FormField, FormInput } from "~/components/ui/form";
import { H1, Muted } from "~/components/ui/typography";
import { useAuth } from "~/context/auth-provider";
import { useAnalytics } from "~/hooks/use-analytics";
import { useErrorMessage } from "~/hooks/use-error-message";
import { reportError } from "~/lib/report-error";

const formSchema = v.object({
  email: v.pipe(
    v.string(),
    v.nonEmpty(t`Please enter an email`),
    v.email(t`Please enter a valid email`)
  ),
  password: v.pipe(
    v.string(),
    v.minLength(8, t`Please enter at least 6 characters.`),
    v.maxLength(64, t`Please enter fewer than 64 characters.`)
  ),
});

export default function SignIn() {
  const { trackEvent } = useAnalytics();
  trackEvent("User Viewed Login Screen");
  const { signInWithPassword } = useAuth();
  const router = useRouter();

  const { errorMessage, setErrorMessage } = useErrorMessage();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<v.InferOutput<typeof formSchema>>({
    resolver: valibotResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: v.InferOutput<typeof formSchema>) {
    trackEvent("User Submitted Login Form");
    setErrorMessage(null);
    setIsLoading(true);
    try {
      await signInWithPassword({ email: data.email, password: data.password });
      trackEvent("User Logged In");
      form.reset();
    } catch (error: unknown) {
      reportError(error);
      setErrorMessage(
        t`There is something wrong with your email or password, or you do not have an account. Please try again.`
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background p-4">
      {isLoading && (
        <ActivityIndicator
          size="large"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      )}
      <View className="flex-1 pt-8">
        <H1 className="self-start">{t`Sign In`}</H1>
        <Muted className="self-start mb-5">
          {t`to continue to Expo Supabase Starter`}
        </Muted>
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormInput
                  label={t`Password`}
                  placeholder={t`Password`}
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry
                  {...field}
                />
              )}
            />
          </View>
        </Form>
        <Muted
          onPress={() => {
            router.replace("/reset-password");
          }}
        >
          {t`Don't remember your password?`}{" "}
          <Muted className="text-foreground">{t`Reset Your Password`}</Muted>
        </Muted>
      </View>
      {errorMessage && <ErrorInlineDisplay message={errorMessage} />}
      <View className="gap-y-4">
        <Button
          size="default"
          variant="default"
          onPress={form.handleSubmit(onSubmit)}
        >
          {form.formState.isSubmitting ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text>{t`Sign In`}</Text>
          )}
        </Button>
        <Muted
          className="text-center"
          onPress={() => {
            router.replace("/sign-up");
          }}
        >
          {t`Don't have an account?`}{" "}
          <Muted className="text-foreground">{t`Sign up`}</Muted>
        </Muted>
      </View>
    </SafeAreaView>
  );
}
