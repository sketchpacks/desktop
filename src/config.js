module.exports = {
  __PRODUCTION__: process && (process.execPath.search('electron-prebuilt') === -1),
  __DEVELOPMENT__: process && (process.execPath.search('electron-prebuilt') !== -1),
  __ELECTRON__: (typeof process !== "undefined") && process.versions && (process.versions.electron !== undefined),

  RELEASE_SERVER_URL: 'https://sketchpacks-releases.herokuapp.com',
  APP_VERSION: require('../package.json').version,
  SERVER_PORT: process.env.PORT || 8080
}
