const jwt = require('jsonwebtoken')

module.exports = (event, context, callback) => {
  const secret = Buffer.from(process.env.JWT_HS256_KEY, 'base64')
  const authorization = event.authorizationToken
  const methodArn = event.methodArn

  if (!authorization) {
    console.log('Access denied: no authorization provided.')
    callback(null, 'Unauthorized')
  }

  if (authorization.indexOf('Bearer') !== 0) {
    console.log('Access denied: No Bearer token.')
    callback(null, 'Unauthorized')
  }

  try {
    const token = authorization.replace('Bearer ', '')
    const decoded = jwt.verify(token, secret)

    const policyEffect = decoded && decoded.userId ? 'Allow' : 'Deny'
    const policy = generateAuthResponse(decoded.userId, policyEffect, methodArn)
    console.log('Authorizer Policy', JSON.stringify(policy, null, 4))
    return callback(null, policy)
  } catch (error) {
    console.log('error verifying token', error)
    callback(null, 'Unauthorized')
  }
}

function generateAuthResponse (principalId, effect, methodArn) {
  const policyDocument = generatePolicyDocument(effect, methodArn)

  return {
    principalId,
    policyDocument
  }
}

function generatePolicyDocument (effect, methodArn) {
  if (!effect || !methodArn) return null

  const policyDocument = {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: methodArn
      }
    ]
  }

  return policyDocument
}
