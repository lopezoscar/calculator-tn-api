const UserModel = require('../models/user-model')

module.exports = function (db) {
  return {
    userModel: new UserModel()
  }
}
