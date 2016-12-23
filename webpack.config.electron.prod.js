/* eslint strict: 0 */
'use strict';

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

var argv = require('minimist')(process.argv.slice(2))
const isWeb = (argv && argv.target === 'web')
const isProd = process.env.NODE_ENV === 'production'
const output = (isWeb ? 'assets/platform/web' : 'assets/platform/electron')
const htmlTemplate = isWeb ? 'index.web.html' : 'index.electron.html'

let options = {
  entry: './index.js',

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'src', 'dist'),
    libraryTarget: 'commonjs2'
  },

  target: 'electron',

  context: path.resolve(__dirname, 'src'),

  devtool: false,

  node: {
    __dirname: false,
    __filename: false
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
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: ['css-loader', 'sass-loader']
        }),
        exclude: [
          /(dist)/
        ]
      }
    ]
  },

  plugins: [
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      template: './index.electron.html'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new ExtractTextPlugin("styles.css")
  ],

  resolve: {
    extensions: ['.js', '.scss', '.electron.js']
  }
}

module.exports = options
