module.exports = {
  __PRODUCTION__: (typeof process !== "undefined") && (typeof process.execPath !== "undefined") && (process.execPath.search('electron-prebuilt') === -1) || false,
  __DEVELOPMENT__: (typeof process !== "undefined") && (typeof process.execPath !== "undefined") && (process.execPath.search('electron-prebuilt') !== -1) || true,
  __ELECTRON__: (typeof process !== "undefined") && process.versions && (process.versions.electron !== undefined),

  RELEASE_SERVER_URL: 'https://sketchpacks-releases.herokuapp.com',
  APP_VERSION: require('../package.json').version,
  SERVER_PORT: process.env.PORT || 8080,

  WEB_URL: process.env.NODE_ENV === 'development' ? 'https://sketchpacks-dev.firebaseapp.com' : 'https://www.sketchpacks.com',
  API_URL: 'https://sketchpacks-api.herokuapp.com/',

  CATALOG_FETCH_DELAY: '10s',
  CATALOG_FETCH_INTERVAL: '30s' 
}
