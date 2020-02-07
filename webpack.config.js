const path = require("path");
const HtmlPlugin = require("html-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  target: "electron-renderer",
  entry: "./src/main.jsx",
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].js"
  },
  node: {
    __dirname: false
  },
  externals: [
    nodeExternals({
      modulesFromFile: {
        exclude: ["devDependencies"]
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, "src"),
        use: ["babel-loader"]
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      "react-dom": "@hot-loader/react-dom"
    }
  },
  plugins: [new HtmlPlugin()]
};
