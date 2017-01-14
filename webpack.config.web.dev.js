/* eslint strict: 0 */
'use strict';

const { SERVER_PORT } = require('./src/config')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

var argv = require('minimist')(process.argv.slice(2))
const isWeb = (argv && argv.target === 'web')
const isProd = process.env.NODE_ENV === 'production'
const output = (isWeb ? 'assets/platform/web' : 'assets/platform/electron')
const htmlTemplate = isWeb ? 'index.web.html' : 'index.electron.html'

let options = {
  entry: [
    'react-hot-loader/patch',
    `webpack-dev-server/client?http://localhost:${SERVER_PORT}/`,
    'webpack/hot/only-dev-server',
    './index.js'
  ],

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist', 'web'),
    publicPath: '/'
  },

  target: 'web',

  context: path.resolve(__dirname, 'src'),

  devtool: isProd ? false : 'source-map',

  devServer: {
    hot: true,
    contentBase: path.resolve(__dirname, 'src', 'dist'),
    publicPath: `http://localhost:${SERVER_PORT}/`,
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
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './index.web.html'
    })
  ],

  resolve: {
    extensions: ['.js', '.scss', '.web.js'],
    modules: [path.resolve(__dirname, "src"), "node_modules"]
  }
}

module.exports = options
