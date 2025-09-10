const path = require("path");
const config = require("config");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isProduction = config.get("env") == "production";

const mycfg = config.get("potion");

module.exports = {
  target: "web",
  mode: isProduction ? "production" : "development",
  // context: path.resolve(__dirname, "."), // to automatically find tsconfig.json
  entry: {
    potion: path.resolve(__dirname, "./entry/game.ts"),
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  experiments: {
    // outputModule: true,
  },
  devtool: isProduction ? undefined : "source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          // disable type checker - we will use it in fork plugin
          transpileOnly: true,
        },
      },
      {
        test: /\.(webp|png|jpe?g|gif|svg|json)$/i,
        loader: "file-loader",
        options: {
          name: "[name].[ext]?[contenthash]",
          outputPath: "assets.png",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "MetaMask Auth POC",
      template: path.resolve(__dirname, "./entry/index.html"),
      inject: "body",
    }),
    new ForkTsCheckerWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [{ from: "assets/processed/", to: "static/" }],
    }),
  ],
  output: {
    filename: isProduction
      ? "[name].[chunkhash].bundle.js"
      : "[name].bundle.js",
    clean: isProduction,
    path: path.resolve(__dirname, "./dist"),
    environment: {
      module: true,
    },
  },
  devServer: {
    port: mycfg.port,
    bonjour: true,
    allowedHosts: "all",
    static: { directory: path.resolve(__dirname, "./dist") },
    historyApiFallback: true,
    proxy: {
      "/api": `http://localhost:${config.get("server.port")}`,
    },
  },
};
