const path = require('path');

module.exports = {
  entry: {
    app: path.join(__dirname, 'src', 'index.js'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
  devServer: {
    static: {
        directory: path.join(__dirname,  'dist'),
      },
    // contentBase: path.join(__dirname, 'dist'),
    // disableHostCheck: true,
    hot: false,
    // quiet: false,
    // noInfo: false,
    // stats: {
    //   colors: true,
    // },
    compress: true,
    port: 3001,
  }
};