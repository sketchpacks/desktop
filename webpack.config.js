/* eslint strict: 0 */
'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpackTargetElectronRenderer = require('webpack-target-electron-renderer');

var argv = require('minimist')(process.argv.slice(2));
const isWeb = (argv && argv.target === 'web');
const isProd = process.env.NODE_ENV === 'production';
const output = (isWeb ? 'assets/platform/web' : 'assets/platform/electron');
const htmlTemplate = isWeb ? 'index.web.html' : 'index.electron.html'

let options = {
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'app', 'dist'),
    publicPath: './'
  },

  context: path.resolve(__dirname, 'app'),

  devtool: isProd ? false : 'inline-source-map',

  module: {
    rules: [
      {
        test: /\.js?$/,
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
        test: /\.sass|\.scss?$/,
        exclude: [
          /node_modules/,
          /dist/
        ],
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },

  plugins: [
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'build', htmlTemplate)
    })
  ],

  resolve: {
    extensions: ['.js', '.json', '.coffee', '.css', '.scss', '.sass']
  }
}

if (isProd) {
  options.entry = {
    main: './index.js'
  }
  options.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true
      }
    })
  )
}

if (!isProd) {
  options.plugins.push(new webpack.HotModuleReplacementPlugin())
  options.entry = {
    server: [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server'
    ],
    main: './index.js'
  }
  options.devServer = {
    hot: true,
    contentBase: path.resolve(__dirname, 'app', 'dist'),
    publicPath: '/'
  }
}

module.exports = options
