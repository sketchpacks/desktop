/* eslint strict: 0 */
'use strict';

const path = require('path');
const menubar = require('menubar');

const opts = {
  dir: __dirname,
  icon: __dirname + '/app/IconTemplate.png',
  width: 640,
  height: 600,
  index: `file://${__dirname}/app/index-electron.html`,
  resizable: false
}

const menuBar = menubar(opts)

menuBar.on('ready', function () {
  console.log('app is ready')
})

menuBar.on('after-create-window', function () {
  menuBar.window.show()
})
