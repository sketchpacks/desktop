module.exports = {
  RELEASE_SERVER_URL: 'https://sketchpacks-releases.herokuapp.com',
  APP_VERSION: require('../package.json').version,
  SERVER_PORT: process.env.PORT || 8080
}
