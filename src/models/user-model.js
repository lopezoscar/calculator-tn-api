const USERS_COLLECTION = 'users'
const { getDB } = require('../db')

class UserModel {
  getUserByUsername (username) {
    return getDB().collection(USERS_COLLECTION).findOne({ username })
  }
}

module.exports = UserModel
