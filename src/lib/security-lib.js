const bcrypt = require('bcryptjs')
const SALT = 10

exports.comparePasswords = ({ plainPassword, passwordHashed }) => {
  return bcrypt.compare(plainPassword, passwordHashed)
}

exports.hashPassword = (password) => {
  return bcrypt.hash(password, SALT)
}
