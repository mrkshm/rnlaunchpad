import { Link, useRouter } from "expo-router";
import { t, Trans } from "@lingui/macro";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, View } from "react-native";
import * as v from "valibot";
import { valibotResolver } from "@hookform/resolvers/valibot";

import { SafeAreaView } from "~/components/safe-area-view";
import { Button } from "~/components/ui/button";
import { Form, FormField, FormInput } from "~/components/ui/form";
import { Text } from "~/components/ui/text";
import { H1, Muted } from "~/components/ui/typography";
import { useAuth } from "~/context/auth-provider";
import ErrorInlineDisplay from "~/components/error-inline-display";
import { reportError } from "~/lib/report-error";

const formSchema = v.pipe(
  v.object({
    email: v.pipe(v.string(), v.email(t`Please enter a valid email address.`)),
    password: v.pipe(
      v.string(),
      v.minLength(8, t`Please enter at least 8 characters.`),
      v.maxLength(64, t`Please enter fewer than 64 characters.`),
      v.regex(
        /^(?=.*[a-z])/,
        t`Your password must have at least one lowercase letter.`
      ),
      v.regex(
        /^(?=.*[A-Z])/,
        t`Your password must have at least one uppercase letter.`
      ),
      v.regex(/^(?=.*[0-9])/, t`Your password must have at least one number.`)
    ),
    confirmPassword: v.pipe(
      v.string(),
      v.minLength(8, t`Please enter at least 8 characters.`)
    ),
  }),
  v.check(
    (data) => data.password === data.confirmPassword,
    t`Your passwords do not match.`
  )
);

export default function SignUp() {
  const { signUp } = useAuth();
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<v.InferOutput<typeof formSchema>>({
    resolver: valibotResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: v.InferOutput<typeof formSchema>) {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const { error, success } = await signUp({ ...data });

      if (error) throw error;

      const pathname =
        success === "login" ? "/(protected)/home" : "/(public)/confirm";

      form.reset();
      router.push({
        pathname,
        params: { email: data.email },
      });
    } catch (error: Error | any) {
      reportError(error);
      setErrorMessage(t`Something went wrong. Maybe you already have an account with this
        email address?`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background p-4">
      <View className="flex-1 pt-8">
        <H1 className="self-start">{t`Sign Up`}</H1>
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormInput
                  label={t`Confirm Password`}
                  placeholder={t`Confirm password`}
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry
                  {...field}
                />
              )}
            />
          </View>
        </Form>
      </View>
      {errorMessage && <ErrorInlineDisplay message={errorMessage} />}
      <View className="gap-y-4">
        <Muted className="text-center">
          <Trans>
            By clicking on the sign-up button, you agree to our{" "}
            <Link href="/(public)/terms-and-conditions">
              terms and conditions
            </Link>
            .
          </Trans>
        </Muted>
        <Button
          size="default"
          variant="default"
          onPress={form.handleSubmit(onSubmit)}
        >
          {isLoading ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text>{t`Sign Up`}</Text>
          )}
        </Button>
        <Muted
          className="text-center"
          onPress={() => {
            setErrorMessage(null);
            router.replace("/sign-in");
          }}
        >
          {t`Already have an account?`}{" "}
          <Muted className="text-foreground">{t`Sign in`}</Muted>
        </Muted>
      </View>
    </SafeAreaView>
  );
}
