const { comparePasswords, hashPassword } = require('../lib/security-lib')
const { createToken } = require('../lib/token-lib')
const UnauthorizedError = require('../errors/UnauthorizedError')
const UserModel = require('../models/user-model')
const ValidationError = require('../errors/ValidationError')
const InternalServerError = require('../errors/InternalServerError')

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

  async register ({ username, password }) {
    let user
    try {
      user = await this.userModel.getUserByUsername(username)
    } catch (error) {
      throw new InternalServerError('error getting user')
    }

    if (user) {
      throw new ValidationError('username exists')
    }

    try {
      const newUser = {
        username
      }

      const passwordHash = await hashPassword(password)
      newUser.password = passwordHash

      const { insertedId } = await this.userModel.saveUser(newUser)
      if (!insertedId) {
        throw new Error('user not created in db')
      }

      const accessToken = createToken({ payload: { userId: insertedId } })

      return {
        accessToken
      }
    } catch (error) {
      console.log(error)
      throw new InternalServerError('error creating user')
    }
  }
}

module.exports = AuthService
