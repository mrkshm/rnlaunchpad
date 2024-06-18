import { useLingui } from "@lingui/react";

import type { Option } from "~/components/ui/select";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "~/lib/constants";
import * as catalogs from "~/lib/language-catalogs";
import { supabase } from "~/lib/supabase-client";
import { useAuth } from "~/context/auth-provider";

export const loadCatalog = (languageCode: SupportedLanguage) => {
  if (!(languageCode in SUPPORTED_LANGUAGES)) {
    throw new Error(`Unsupported language: ${languageCode}`);
  }
  const catalog = catalogs[languageCode];
  if (!catalog) {
    throw new Error(`Unsupported language / No dictionary: ${languageCode}`);
  }
  return catalog;
};

export const useActivateLocale = () => {
  const { i18n } = useLingui();
  const { user } = useAuth();

  const loadAndActivateLocale = async (newActiveLanguage: Option) => {
    const activeLanguage = i18n.locale;
    if (newActiveLanguage) {
      if (activeLanguage === newActiveLanguage.value) return;
      if (user) {
        console.log("We have a user", user.id);
        supabase
          .from("user_profiles")
          .update({
            language: newActiveLanguage.value,
          })
          .eq("user_id", user.id)
          .then(({ error }) => {
            if (error) {
              console.log(
                "There was an error saving the language to the profile"
              );
            }
          });
      }
      const catalog = loadCatalog(newActiveLanguage.value as SupportedLanguage);
      i18n.load(newActiveLanguage.value, catalog);
      i18n.activate(newActiveLanguage.value);
    } else {
      const catalog = loadCatalog("en");
      i18n.load("en", catalog.messages);
      i18n.activate("en");
    }
  };

  return loadAndActivateLocale;
};
