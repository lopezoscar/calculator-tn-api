const bcrypt = require('bcryptjs')

class Security {
  comparePassword ({ plainPassword, passwordHashed }) {
    return bcrypt.compare(plainPassword, passwordHashed)
  }
}

module.exports = Security
