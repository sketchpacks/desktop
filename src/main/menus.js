const {remote, shell} = require('electron')
const {Menu, MenuItem} = remote
const AutoLaunch = require('auto-launch')

const autolauncher = new AutoLaunch({
	name: 'Sketchpacks'
})

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
    label: 'Launch at startup',
    type: 'checkbox',
    checked: autolauncher.isEnabled().then(isEnabled => isEnabled),
    click(item, window, event) {
      autolauncher.isEnabled()
        .then(isEnabled => {
          if (isEnabled) {
            item.checked = false
            autolauncher.disable()
          } else {
            item.checked = true
            autolauncher.enable()
          }
        })
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
    type: 'separator'
  },

  {
    label: 'Export My Library',
    click(item, window, event) {
      window.webContents.send('EXPORT_LIBRARY', null)
    },
  },

  {
    type: 'separator'
  },

  {
    label: 'Import a Sketchpack',
    click(item, window, event) {
      window.webContents.send('IMPORT_FROM_SKETCHPACK', null)
    },
  },

  {
    label: 'Import from Sketch Toolbox',
    click(item, window, event) {
      window.webContents.send('IMPORT_FROM_SKETCH_TOOLBOX', null)
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
