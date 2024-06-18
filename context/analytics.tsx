import { createContext, useContext, useEffect, useState } from "react";
import { Mixpanel } from "mixpanel-react-native";
import { safeEnvs } from "~/lib/env";

const initMixpanel = async () => {
  if (safeEnvs.enableAnalytics) {
    try {
      const trackAutomaticEvents = false;
      const mixpanel = new Mixpanel(
        safeEnvs.mixpanelToken,
        trackAutomaticEvents
      );
      await mixpanel.init();
      return mixpanel;
    } catch (error) {
      console.error("Error initializing Mixpanel:", error);
      return null; // Return null in case of initialization failure
    }
  } else {
    // Return a fake Mixpanel object with no-op functions
    return {
      track: (eventName: string, properties?: any) => {
        console.log(`[Mixpanel Mock] Event tracked: ${eventName}`, properties);
      },
      identify: (userId: string) => {
        console.log(`[Mixpanel Mock] User identified: ${userId}`);
      },
    };
  }
};

interface MixpanelContextType {
  mixpanel: Mixpanel | any;
}

const MixpanelContext = createContext<MixpanelContextType>({ mixpanel: null });

export const useMixpanel = () => useContext(MixpanelContext);

export function AnalyticsProvider({ children }: React.PropsWithChildren<{}>) {
  const [mixpanel, setMixpanel] = useState<Mixpanel | null>(null);

  useEffect(() => {
    const initialize = async () => {
      const mixpanelInstance = await initMixpanel();
      setMixpanel(mixpanelInstance as Mixpanel | null); // Update state after initialization
    };

    initialize();

    return () => {
      if (mixpanel) {
        mixpanel.flush();
      }
    };
  }, []);

  return (
    <MixpanelContext.Provider value={{ mixpanel }}>
      {children}
    </MixpanelContext.Provider>
  );
}
