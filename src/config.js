module.exports = {
  __PRODUCTION__: (typeof process !== "undefined") && (typeof process.execPath !== "undefined") && (process.execPath.search('electron-prebuilt') === -1) || false,
  __DEVELOPMENT__: (typeof process !== "undefined") && (typeof process.execPath !== "undefined") && (process.execPath.search('electron-prebuilt') !== -1) || true,
  __ELECTRON__: (typeof process !== "undefined") && process.versions && (process.versions.electron !== undefined),

  RELEASE_SERVER_URL: 'https://sketchpacks-releases.herokuapp.com',
  APP_VERSION: require('../package.json').version,
  SERVER_PORT: process.env.PORT || 8080,

  WEB_URL: 'https://sketchpacks-dev.firebaseapp.com',
  API_URL: 'https://sketchpacks-api.herokuapp.com/',

  CATALOG_FETCH_DELAY: '10s',
  CATALOG_FETCH_INTERVAL: process.env.NODE_ENV === 'development' ? '10s' : '30m',

  HOME_PATH: process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE,
  PLUGIN_PATHS: [
    "/Library/Application Support/com.bohemiancoding.sketch3/Plugins/", // Sketch 3
    "/Library/Containers/com.bohemiancoding.sketch3/Data/Library/Application Support/com.bohemiancoding.sketch3/Plugins/", // Sketch 3 (MAS)
    "/Library/Containers/com.bohemiancoding.sketch3.beta/Data/Library/Application Support/com.bohemiancoding.sketch3/Plugins/", // Sketch 3 Beta
    "/Library/Containers/com.bohemiancoding.sketch/Data/Library/Application Support/sketch/Plugins/", // Sketch 2 (MAS)
    "/Library/Application Support/sketch/Plugins/", // Sketch 2
    "/Downloads/" // Fallback
  ]
}
