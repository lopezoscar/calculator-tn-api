const USERS_COLLECTION = 'users'
const { getDB } = require('../db')
const mongodb = require('mongodb')

class UserModel {
  getUserByUsername (username) {
    return getDB().collection(USERS_COLLECTION).findOne({ username })
  }

  getUserById (userId) {
    return getDB().collection(USERS_COLLECTION).findOne({ _id: new mongodb.ObjectId(userId) })
  }

  saveUser (user) {
    return getDB().collection(USERS_COLLECTION).insertOne(user)
  }

  decrementUserBalance ({ userId, cost }) {
    const query = {
      _id: new mongodb.ObjectId(userId)
    }
    const update = {
      $inc: {
        balance: -cost
      }
    }
    return getDB().collection(USERS_COLLECTION).findOneAndUpdate(query, update, { returnNewDocument: true })
  }
}

module.exports = UserModel
