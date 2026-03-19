/** @type {import('@bacons/apple-targets/app.plugin').ConfigFunction} */
module.exports = (config) => ({
  type: "widget",
  name: "QuickLaunch",
  frameworks: ["SwiftUI"],
  deploymentTarget: "16.0",
  colors: {
    $accent: { color: "#4A90D9" },
    $widgetBackground: {
      light: "#FFFFFF",
      dark: "#1C1C1E",
    },
  },
});
