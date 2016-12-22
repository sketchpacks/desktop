module.exports = {
  __PRODUCTION__: process && (process.execPath.search('electron-prebuilt') === -1),
  __DEVELOPMENT__: process && (process.execPath.search('electron-prebuilt') !== -1),
  __ELECTRON__: process && (process.execPath.search('electron-prebuilt') === -1),

  RELEASE_SERVER_URL: 'https://sketchpacks-releases.herokuapp.com',
  APP_VERSION: require('../package.json').version,
  SERVER_PORT: process.env.PORT || 8080
}
