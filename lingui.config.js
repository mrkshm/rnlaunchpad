/** @type {import('@lingui/conf').LinguiConfig} */

import { SUPPORTED_LANGUAGES } from "./lib/constants";
module.exports = {
  locales: Object.keys(SUPPORTED_LANGUAGES),
  sourceLocale: "en",
  catalogs: [
    {
      path: "./locales/{locale}/messages",
      include: ["app", "components"],
    },
  ],
  format: "po",
};
