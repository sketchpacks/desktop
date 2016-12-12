/* eslint strict: 0 */
'use strict';

const path = require('path');
const webpack = require('webpack');
const webpackTargetElectronRenderer = require('webpack-target-electron-renderer');
var argv = require('minimist')(process.argv.slice(2));
const isWeb = (argv && argv.target === 'web');
const isProd = process.env.NODE_ENV === 'production';
const output = (isWeb ? 'assets/platform/web' : 'assets/platform/electron');
const config = require('./app/config.js')

let options ={
  module: {
    loaders: [{
      test: /\.js?$/,
      loaders: [ 'babel-loader?presets[]=es2015,presets[]=stage-0,presets[]=react' ],
      exclude: /node_modules/
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

  devtool: !isProd && 'eval',

  debug: !isProd && true,

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress:{
        warnings: true
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': isProd ? JSON.stringify('production') : JSON.stringify('development')
      }
    })
  ]

};

if (!isProd) { options.entry.push('webpack-dev-server/client?http://localhost:8080/')}

options.target = webpackTargetElectronRenderer(options);

module.exports = options;
