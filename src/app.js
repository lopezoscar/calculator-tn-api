const middify = require('./middify')

const modelsLayer = require('./models')
const servicesLayer = require('./services')
const routersLayer = require('./routers')

const models = modelsLayer({})
const services = servicesLayer(models)
const routers = routersLayer(services)

exports.auth = middify((event) => routers.authRouter.auth(event))
