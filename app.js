// const modelsLayer = require('./src/models')
// const servicesLayer = require('./src/services')
// const routersLayer = require('./src/routers')

// const { connectToDatabase } = require('./src/db')

// const models = modelsLayer()
// const services = servicesLayer(models)
// const routers = routersLayer(services)

const { connectToDatabase } = require('./src/db')
const auth = require('./src/handlers/auth-handler')

exports.auth = createHandler(auth)

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
