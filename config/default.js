if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({
    silent: false,
  });
}

module.exports = {
  env: process.env.NODE_ENV,

  server: {
    port: process.env.PORT || 3001,
    apiHost: process.env.API_HOST || "localhost:3001",
    publicHost: process.env.PUBLIC_HOST || "localhost:3000",
    protocol: process.env.REQUIRE_SSL ? "https" : "http",
    requireSsl: process.env.REQUIRE_SSL !== "false",
  },

  devServer: {
    url: "http://localhost",
    port: 3000,
    hot: true,
    inline: true,
    noInfo: true,
    disableHostCheck: ["1", "true"].includes(
      process.env.DEV_SERVER_DISABLE_HOST_CHECK,
    ),
  },

  potion: {
    url: "http://localhost",
    port: 3002,
    hot: true,
    inline: true,
    noInfo: true,
    disableHostCheck: ["1", "true"].includes(
      process.env.DEV_SERVER_DISABLE_HOST_CHECK,
    ),
  },
};
