
const UserModel = require('../models/user-model')
const { connectToDatabase } = require('../db')

module.exports = async function () {
  const db = await connectToDatabase()
  return {
    userModel: new UserModel(db)
  }
}
