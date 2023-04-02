const { connectToDatabase } = require('./src/db')

const auth = require('./src/handlers/auth-handler')
const register = require('./src/handlers/register-handler')
const calculateBasic = require('./src/handlers/calculate-basic-handler')

exports.auth = createHandler(auth)
exports.register = createHandler(register)
exports.calculateBasic = createHandler(calculateBasic)

function createHandler (handlerFn) {
  const handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false
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
