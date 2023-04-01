const jwt = require('jsonwebtoken')

class Token {
  createToken ({ payload, options = { expiresIn: '1h' } }) {
    const token = jwt.sign(
      payload,
      process.env.JWT_HS256_KEY,
      options
    )
    return token
  }
}

module.exports = Token
