const {remote, shell} = require('electron')
const {Menu, MenuItem} = remote

const settingsMenu = [
  {
    role: 'about'
  },
  {
    label: `Sketchpacks v${remote.app.getVersion()}`,
    enabled: false,
  },
  {
    label: 'Check for Update',
    click(item, window, event) {
      window.webContents.send('CHECK_FOR_CLIENT_UPDATES', { confirm: true })
    },
  },

  {
    type: 'separator'
  },

  {
    label: 'Visit Sketchpacks.com',
    click: () => shell.openExternal('https://www.sketchpacks.com')
  },
  {
    label: 'Report a Bug',
    click: () => shell.openExternal('https://github.com/sketchpacks/bug-reports/issues')
  },
  {
    label: 'Give Feedback',
    click: () => shell.openExternal('https://github.com/sketchpacks/feedback/issues')
  },

  {
    type: 'separator'
  },

  {
    label: 'Check for Plugin Updates',
    accelerator: 'Cmd+U',
    click(item, window, event) {
      window.webContents.send('CHECK_FOR_PLUGIN_UPDATES', null)
    },
  },
  {
    label: 'Check for Catalog Updates',
    accelerator: 'Cmd+R',
    click(item, window, event) {
      window.webContents.send('CHECK_FOR_CATALOG_UPDATES', null)
    },
  },

  {
    type: 'separator'
  },

  {
    role: 'quit',
    accelerator: 'Cmd+Q'
  },
]

exports.settingsMenu = Menu.buildFromTemplate(settingsMenu)