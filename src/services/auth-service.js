const { comparePasswords } = require('../lib/security-lib')
const { createToken } = require('../lib/token-lib')
const UnauthorizedError = require('../errors/UnauthorizedError')
const UserModel = require('../models/user-model')

class AuthService {
  constructor () {
    this.userModel = new UserModel()
  }

  async auth ({ username, password }) {
    try {
      const user = await this.userModel.getUserByUsername(username)
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
      throw new UnauthorizedError('INVALID_LOGIN')
    }
  }
}

module.exports = AuthService
