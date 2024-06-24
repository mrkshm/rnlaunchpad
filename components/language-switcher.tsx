import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { Option } from "~/components/ui/select";
import { SUPPORTED_LANGUAGES, SupportedLanguage } from "~/lib/constants";
import { useAuth } from "~/context/auth-provider";
import { notifyUser } from "~/lib/notify-user";

import { useActivateLocale } from "~/hooks/use-activate-locale";

export default function LanguageSwitcher() {
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  // const { i18n } = useLingui();
  const loadAndActivateLocale = useActivateLocale();
  const { profile } = useAuth();

  const handleSelectionChange = (option: Option) => {
    if (!option || !(option.value in SUPPORTED_LANGUAGES)) {
      notifyUser({ title: "Error", message: "Unsupported language selection" });
      return;
    }
    loadAndActivateLocale(option);
  };

  return (
    <Select
      defaultValue={{
        value: profile?.language ?? "en",
        label:
          profile?.language && profile.language in SUPPORTED_LANGUAGES
            ? SUPPORTED_LANGUAGES[profile.language as SupportedLanguage]
            : "English",
      }}
      onValueChange={handleSelectionChange}
    >
      <SelectTrigger className="w-[250px]">
        <SelectValue
          className="text-foreground text-sm native:text-lg"
          placeholder="Select a fruit"
        />
      </SelectTrigger>
      <SelectContent insets={contentInsets} className="w-[250px]">
        <SelectGroup>
          <SelectLabel>Languages</SelectLabel>
          {Object.entries(SUPPORTED_LANGUAGES).map(([key, value]) => (
            <SelectItem key={key} label={value} value={key}>
              {key}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
