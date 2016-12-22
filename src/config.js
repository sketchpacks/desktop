module.exports = {
  __PRODUCTION__: (typeof process !== "undefined") && (typeof process.execPath !== "undefined") && (process.execPath.search('electron-prebuilt') === -1) || false,
  __DEVELOPMENT__: (typeof process !== "undefined") && (typeof process.execPath !== "undefined") && (process.execPath.search('electron-prebuilt') !== -1) || true,
  __ELECTRON__: (typeof process !== "undefined") && process.versions && (process.versions.electron !== undefined),

  RELEASE_SERVER_URL: 'https://sketchpacks-releases.herokuapp.com',
  APP_VERSION: require('../package.json').version,
  SERVER_PORT: process.env.PORT || 8080
}
