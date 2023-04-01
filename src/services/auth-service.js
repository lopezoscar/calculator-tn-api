const { comparePasswords } = require('../lib/security-lib')
const { createToken } = require('../lib/token-lib')
const ValidationError = require('../errors/ValidationError')

class AuthService {
  constructor (models) {
    this.models = models
  }

  async auth ({ username, password }) {
    const { userModel } = this.models
    try {
      const user = await userModel.getUserByUsername(username)
      if (!user) {
        throw new Error('user not found')
      }
      const validPassword = comparePasswords({ plainPassword: password, passwordHashed: user.password })

      if (validPassword) {
        return createToken({ payload: { userId: user.id } })
      }

      throw new Error('invalid password')
    } catch (error) {
      console.log(error)
      throw new ValidationError('INVALID_LOGIN')
    }
  }
}

module.exports = AuthService
