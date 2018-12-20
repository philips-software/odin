/* eslint-env node */
const path = require('path');

module.exports = {
  entry: {
    odin: './src/index.js',
  },
  
  output: {
    path: path.resolve(__dirname),
    filename: '[name].js'
  },
  
  devtool: 'inline-source-map',
  mode: 'development',
  
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  }
};