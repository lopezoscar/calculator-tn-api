const middify = require('./middify')

const AuthRouter = require('./routers/auth-router')
const authRouter = new AuthRouter()
exports.auth = middify(authRouter.auth)
