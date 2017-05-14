const {app, Menu, MenuItem} = require('electron')

const inputMenu = [
  {role: 'undo'},
  {role: 'redo'},
  {type: 'separator'},
  {role: 'cut'},
  {role: 'copy'},
  {role: 'paste'},
  {type: 'separator'},
  {role: 'selectall'}
]

exports.inputMenu = Menu.buildFromTemplate(inputMenu)
