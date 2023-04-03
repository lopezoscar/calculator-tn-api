const { connectToDatabase } = require('./src/db')

const auth = require('./src/handlers/auth-handler')
const register = require('./src/handlers/register-handler')
const calculateBasic = require('./src/handlers/calculate-basic-handler')
const calculateRandom = require('./src/handlers/calculate-random-handler')
const listRecordsByUserId = require('./src/handlers/list-records-by-user-id-handler')
const deleteRecord = require('./src/handlers/delete-record-handler')

const authorizeRequest = require('./src/handlers/authorize-request-handler')

exports.authorizeRequest = authorizeRequest

exports.auth = createHandler(auth)
exports.register = createHandler(register)
exports.calculateBasic = createHandler(calculateBasic)
exports.calculateRandom = createHandler(calculateRandom)
exports.listRecordsByUserId = createHandler(listRecordsByUserId)
exports.deleteRecord = createHandler(deleteRecord)

function createHandler (handlerFn) {
  const handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false
    event.userId = event.requestContext?.authorizer?.principalId
    await connectToDatabase()
    event.body = parseBody(event.body)

    return handlerFn(event)
  }
  return handler
}

const parseBody = (body) => {
  try {
    if (body) {
      return JSON.parse(body)
    }
  } catch (error) {
    console.log('ERROR PARSING BODY', error)
    return body
  }
}
