const AuthService = require('./auth-service')

module.exports = function (models) {
  return {
    authService: new AuthService(models)
  }
}
