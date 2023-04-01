const Joi = require('joi')
const CreateError = require('http-errors')

const ValidationError = require('../errors/ValidationError')
const { StatusCodes } = require('http-status-codes')

const schema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
})

function validate (data) {
  const { error } = schema.validate(data)
  if (error) {
    throw new ValidationError(error)
  }
}

class AuthRouter {
  constructor (services) {
    this.services = services
  }

  async auth ({ body }) {
    const { authService } = this.services
    try {
      const params = body
      validate(params)
      const response = await authService.auth(body)
      return {
        statusCode: StatusCodes.CREATED,
        body: JSON.stringify(response)
      }
    } catch (error) {
      console.log(error)
      if (error instanceof ValidationError) {
        throw new CreateError.BadRequest('BAD REQUEST: Please check parameters')
      } else {
        throw new CreateError(StatusCodes.INTERNAL_SERVER_ERROR)
      }
    }
  }
}

module.exports = AuthRouter
