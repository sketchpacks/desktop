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
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'app', 'dist'),
    publicPath: '/'
  },

  context: path.resolve(__dirname, 'app'),

  devtool: isProd ? false : 'source-map',

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: ['es2015','stage-0','react']
        },
        exclude: [
          /node_modules/,
          /dist/
        ]
      },
      {
        test: /\.scss$/,
        exclude: [
          /dist/
        ],
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },

  plugins: [
    new webpack.NamedModulesPlugin()
  ],

  resolve: {
    extensions: ['.js', '.coffee', '.scss']
  }
}


module.exports = options
