import { useEffect } from "react";

import { useMixpanel } from "~/context/analytics";
import { useAuth } from "~/context/auth-provider";
import { safeEnvs } from "~/lib/env";

export function useAnalytics() {
  const { mixpanel } = useMixpanel();
  const { user } = useAuth();

  useEffect(() => {
    const identifyUser = async () => {
      if (user && mixpanel) mixpanel.identify(user.id);
    };

    identifyUser();
  }, [mixpanel, user]);

  const trackEvent = (eventName: string, properties?: any) => {
    if (safeEnvs.enableAnalytics && mixpanel) {
      try {
        mixpanel.track(eventName, properties);
      } catch (error) {
        console.error(`[Analytics] Error tracking event: ${eventName}`, error);
      }
    } else {
      console.log(`[Analytics] Event tracked: ${eventName}`, properties);
    }
  };

  return { trackEvent };
}
