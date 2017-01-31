/* eslint strict: 0 */
'use strict';

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

var argv = require('minimist')(process.argv.slice(2))
const isWeb = (argv && argv.target === 'web')
const isProd = process.env.NODE_ENV === 'production'
const output = (isWeb ? 'assets/platform/web' : 'assets/platform/electron')
const htmlTemplate = isWeb ? 'index.web.html' : 'index.electron.html'

let options = {
  entry: './index.js',

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist', 'web'),
    publicPath: '/'
  },

  target: 'web',

  context: path.resolve(__dirname, 'src'),

  devtool: false,

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
      },
      {
        test: /\.css$/,
        exclude: [
          /(dist)/
        ],
        loaders: ['style-loader', 'css-loader']
      }
    ]
  },

  plugins: [
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      template: './index.web.html'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new ExtractTextPlugin("styles.css"),
    new CopyWebpackPlugin([ {
      from: 'static/*',
      to: path.resolve(__dirname,'dist','web')
    } ])
  ],

  resolve: {
    extensions: ['.js', '.scss', '.web.js'],
    modules: [path.resolve(__dirname, "src"), "node_modules"]
  }
}

module.exports = options
