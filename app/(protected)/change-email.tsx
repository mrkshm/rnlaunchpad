import { valibotResolver } from "@hookform/resolvers/valibot";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ActivityIndicator, View } from "react-native";
import * as v from "valibot";
import { t } from "@lingui/macro";

import ErrorInlineDisplay from "~/components/error-inline-display";
import { SafeAreaView } from "~/components/safe-area-view";
import { Button } from "~/components/ui/button";
import { Form, FormField, FormInput } from "~/components/ui/form";
import { Text } from "~/components/ui/text";
import { H1, Muted, P } from "~/components/ui/typography";
import { useAuth } from "~/context/auth-provider";
import { ActivationSource } from "~/lib/schemas-and-types";
import { useErrorMessage } from "~/hooks/use-error-message";

const formSchema = v.object({
  email: v.pipe(
    v.string(),
    v.nonEmpty(t`Please enter an email`),
    v.email(t`Please enter a valid email`)
  ),
});

export default function SignIn() {
  const { changeEmail } = useAuth();
  const router = useRouter();

  const { errorMessage, setErrorMessage } = useErrorMessage();

  const form = useForm<v.InferOutput<typeof formSchema>>({
    resolver: valibotResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: v.InferOutput<typeof formSchema>) {
    setErrorMessage(null);
    try {
      await changeEmail({ email: data.email });
      router.push({
        pathname: "/(public)/confirm",
        params: { email: data.email, source: ActivationSource.EmailChange },
      });

      form.reset();
    } catch (error: Error | any) {
      console.log(error.message);
      setErrorMessage(
        t`There was an error changing your email. Please try again.`
      );
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background p-4">
      <View className="flex">
        <H1 className="self-start">{t`Change your email`}</H1>
        <Muted className="self-start mb-5">
          {t`Please enter your new email address.`}
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
          </View>
        </Form>
      </View>
      <View className="flex-1 mt-8 p-2">
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
            <Text>{t`Change Email`}</Text>
          )}
        </Button>
      </View>
    </SafeAreaView>
  );
}
