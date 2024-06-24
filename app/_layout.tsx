import "~/global.css";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Platform, SafeAreaView } from "react-native";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme, ThemeProvider } from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";

import { PortalHost } from "~/components/primitives/portal";
import ToastNotification from "~/components/toast-notification";
import { AuthProvider } from "~/context/auth-provider";
import { AnalyticsProvider } from "~/context/analytics";
import {
  NAV_THEME,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from "~/lib/constants";
import { loadCatalog } from "~/hooks/use-activate-locale";
import { safeEnvs } from "~/lib/env";
import { queryClient } from "~/lib/query-client";
import { supabase } from "~/lib/supabase-client";
import { useColorScheme } from "~/lib/use-color-scheme";
import { messages } from "~/locales/en/messages.js";
import Bugsnag from "@bugsnag/expo";
safeEnvs.enableErrorReporting && Bugsnag.start();

const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  dark: true,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();

i18n.loadAndActivate({ locale: "en", messages });

function RootLayout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (!sessionData || sessionError) {
        return;
      }
      const { data: authUser, error: authUserError } =
        await supabase.auth.getUser();
      if (authUserError) {
        return;
      } else if (!authUser) {
        return;
      }

      const { data: userProfile, error: userProfileError } = await supabase
        .from("user_profiles")
        .select("language")
        .eq("user_id", authUser.user.id)
        .single();

      if (userProfileError) {
        // console.log("Error fetching user's language: ", userProfileError);
        // Use default language (already loaded) if there's an error
        // i18n.loadAndActivate({
        //   locale: "en",
        //   messages,
        // });
      } else if (userProfile) {
        const userLanguage = userProfile.language;
        if (
          !userLanguage ||
          userLanguage === "en" ||
          !Object.keys(SUPPORTED_LANGUAGES).includes(userLanguage)
        )
          return;
        const catalog = loadCatalog(userLanguage as SupportedLanguage);
        i18n.loadAndActivate({
          locale: userLanguage,
          messages: catalog.messages,
        });
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const theme = await AsyncStorage.getItem("theme");
      if (Platform.OS === "web") {
        // Adds the background color to the html element to prevent white background on overscroll.
        document.documentElement.classList.add("bg-background");
      }
      if (!theme) {
        AsyncStorage.setItem("theme", colorScheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      const colorTheme = theme === "dark" ? "dark" : "light";
      if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme);

        setIsColorSchemeLoaded(true);
        return;
      }
      setIsColorSchemeLoaded(true);
    })().finally(() => {
      SplashScreen.hideAsync();
    });
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AnalyticsProvider>
          <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
            <I18nProvider i18n={i18n}>
              <StatusBar style={isDarkColorScheme ? "light" : "dark"} />

              <ToastNotification />
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              ></Stack>
              <PortalHost />
            </I18nProvider>
          </ThemeProvider>
        </AnalyticsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default RootLayout;
