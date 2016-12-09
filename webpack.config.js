/* eslint strict: 0 */
'use strict';

const path = require('path');
const webpack = require('webpack');
const webpackTargetElectronRenderer = require('webpack-target-electron-renderer');
var argv = require('minimist')(process.argv.slice(2));
const isWeb = (argv && argv.target === 'web');
const output = (isWeb ? 'assets/platform/web' : 'assets/platform/electron');

let options ={
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['babel-loader'],
      exclude: /node_modules/,
    }]
  },
  output: {
    path: path.join(__dirname, output),
    publicPath: path.join(__dirname, 'app'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main'],
  },
  entry: [
    './app/index',
  ],
  debug: true,

};

options.target = webpackTargetElectronRenderer(options);

module.exports = options;
