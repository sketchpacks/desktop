const {app, Menu, MenuItem} = require('electron')

const selectMenu = [
  {role: 'copy'},
  {type: 'separator'},
  {role: 'selectall'}
]

exports.selectMenu = Menu.buildFromTemplate(selectMenu)
