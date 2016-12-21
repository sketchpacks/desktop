/* eslint strict: 0 */
'use strict';

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpackTargetElectronRenderer = require('webpack-target-electron-renderer')

var argv = require('minimist')(process.argv.slice(2))
const isWeb = (argv && argv.target === 'web')
const isProd = process.env.NODE_ENV === 'production'
const output = (isWeb ? 'assets/platform/web' : 'assets/platform/electron')
const htmlTemplate = isWeb ? 'index.web.html' : 'index.electron.html'

let options = {
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:8080/',
    'webpack/hot/only-dev-server',
    './index.js'
  ],

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist', 'web')
  },

  target: 'electron',

  context: path.resolve(__dirname, 'src'),

  devtool: isProd ? false : 'source-map',

  devServer: {
    hot: true,
    contentBase: path.resolve(__dirname, 'dist', 'web'),
    publicPath: 'http://localhost:8080/',
    historyApiFallback: true
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: 'babel-loader',
          }
        ],
        exclude: [
          /(dist)/,
          /(node_modules)/
        ]
      },
      {
        test: /\.scss$/,
        exclude: [
          /(dist)/
        ],
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },

  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './index.electron.html'
    })
  ],

  resolve: {
    extensions: ['.js', '.scss']
  }
}

module.exports = options
