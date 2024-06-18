module.exports = function (api) {
  api.cache(true);
  return {
    plugins: [
      "macros",
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env",
        },
      ],
    ],
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
      // "module:react-native-dotenv",
    ],
  };
};
