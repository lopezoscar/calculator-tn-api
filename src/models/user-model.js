const USERS_COLLECTION = 'users'

class UserModel {
  constructor (db) {
    this.db = db
  }

  getUserByUsername (username) {
    return {
      id: 1,
      username: 'lopezoscar'
    }
    // return this.db.collection(USERS_COLLECTION).find({ username })
  }
}

module.exports = UserModel
