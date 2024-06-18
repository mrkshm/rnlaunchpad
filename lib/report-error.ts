import Bugsnag from "@bugsnag/expo";

import { safeEnvs } from "~/lib/env";

export function reportError(error: unknown) {
  if (!safeEnvs.enableErrorReporting) {
    console.log("There was an error: ", String(error));
    return;
  }

  try {
    if (error instanceof Error) {
      Bugsnag.notify(error);
    } else {
      Bugsnag.notify(new Error(String(error)));
    }
  } catch (reportingError) {
    console.error("Error reporting to Bugsnag:", reportingError);
  }
}
