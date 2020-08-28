const withPWA = require("next-pwa");

module.exports = withPWA({
  // Target must be serverless
  target: "serverless",
  pwa: {
    dest: "public",
    disable: process.env.NODE_ENV === "development",
  },
});
