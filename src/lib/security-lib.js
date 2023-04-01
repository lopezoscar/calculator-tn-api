const bcrypt = require('bcryptjs')

exports.comparePasswords = ({ plainPassword, passwordHashed }) => {
  return bcrypt.compare(plainPassword, passwordHashed)
}
