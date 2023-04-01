const Security = require('../lib/security-lib')
const Token = require('../lib/token-lib')
const ValidationError = require('../errors/ValidationError')

class AuthService {
  constructor (models) {
    this.models = models
  }

  async auth ({ username, password }) {
    const { UserModel } = this.models
    try {
      const user = await UserModel.getUserByUsername(username)
      if (Security.comparePasswords({ plainPassword: password, passwordHashed: user.password })) {
        Token.createToken({ payload: { userId: user.id } })
      }
    } catch (error) {
      throw new ValidationError('invalid login')
    }
  }
}

module.exports = AuthService
