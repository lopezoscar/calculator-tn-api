const AuthRouter = require('./auth-router')

module.exports = function (services) {
  return {
    authRouter: new AuthRouter(services)
  }
}
