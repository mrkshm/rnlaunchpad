import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, View } from "react-native";
import * as v from "valibot";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { t } from "@lingui/macro";

import { SafeAreaView } from "~/components/safe-area-view";
import { Button } from "~/components/ui/button";
import { Form, FormField, FormInput } from "~/components/ui/form";
import { Text } from "~/components/ui/text";
import { H1, Muted } from "~/components/ui/typography";
import { useAuth } from "~/context/auth-provider";
import { useErrorMessage } from "~/hooks/use-error-message";
import ErrorInlineDisplay from "~/components/error-inline-display";

const formSchema = v.pipe(
  v.object({
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

export default function ChangePassword() {
  const { changePassword } = useAuth();
  const router = useRouter();
  const { errorMessage, setErrorMessage } = useErrorMessage();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<v.InferOutput<typeof formSchema>>({
    resolver: valibotResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: v.InferOutput<typeof formSchema>) {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      await changePassword({ password: data.password });
      form.reset();
      router.push({
        pathname: "/(protected)/home",
      });
    } catch (error) {
      setErrorMessage(
        t`There was an error changing your password. Please try again.`
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background p-4">
      {isLoading && <ActivityIndicator size="large" />}
      <View className="flex-1">
        <H1 className="self-start">{t`Change Password`}</H1>
        <Muted className="self-start mb-5">
          {t`Please enter your new password.`}
        </Muted>
        <Form {...form}>
          <View className="gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormInput
                  label={t`New Password`}
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
      <View className="flex-1 mt-24 p-2">
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
            <Text>{t`Change Password`}</Text>
          )}
        </Button>
      </View>
    </SafeAreaView>
  );
}
