const jwt = require('jsonwebtoken')

exports.createToken = ({ payload, options = { expiresIn: '1h' } }) => {
  const token = jwt.sign(
    payload,
    Buffer.from(process.env.JWT_HS256_KEY, 'base64'),
    options
  )
  return token
}
