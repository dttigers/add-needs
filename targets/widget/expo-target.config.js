/** @type {import('@bacons/apple-targets/app.plugin').ConfigFunction} */
module.exports = (config) => ({
  type: "widget",
  name: "QuickLaunch",
  frameworks: ["SwiftUI"],
  deploymentTarget: "17.0",
  colors: {
    $accent: { color: "#4A90D9" },
    $widgetBg: {
      light: "#FFFFFF",
      dark: "#1C1C1E",
    },
  },
});
