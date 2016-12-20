/* eslint strict: 0 */
'use strict';

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

var argv = require('minimist')(process.argv.slice(2))
const isWeb = (argv && argv.target === 'web')
const isProd = process.env.NODE_ENV === 'production'
const output = (isWeb ? 'assets/platform/web' : 'assets/platform/electron')
const htmlTemplate = isWeb ? 'index.web.html' : 'index.electron.html'

let options = {
  entry: ['babel-polyfill','./index.js'],

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'app', 'dist'),
    publicPath: './',
    libraryTarget: 'commonjs2'
  },

  target: 'electron-renderer',

  context: path.resolve(__dirname, 'app'),

  devtool: false,

  node: {
    __dirname: false,
    __filename: false
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: ['./app/index'],
        use: [
          'babel-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        exclude: /node_modules/
      }
    ]
  },

  plugins: [
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      template: './index.electron.html'
    })
  ],

  resolve: {
    extensions: ['.js', '.scss']
  }
}

module.exports = options
