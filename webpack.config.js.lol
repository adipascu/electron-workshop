const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const NotifierPlugin = require('webpack-notifier');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'electron-renderer',
  node: {
    __dirname: false,
  },
  externals: [
    nodeExternals({
      modulesFromFile: {
        exclude: ['devDependencies'],
      },
    }),
  ],
  entry: './src/main.jsx',
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
     
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new HtmlPlugin({
      template: 'src/res/index.ejs',
      excludeChunks: ['acceptor'],
    }),
    new NotifierPlugin(),
  ],
};
