const Joi = require('joi')
const CreateError = require('http-errors')

const ValidationError = require('../errors/ValidationError')
const UnauthorizedError = require('../errors/UnauthorizedError')

const { StatusCodes } = require('http-status-codes')

const AuthService = require('../services/auth-service')
const authService = new AuthService()

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

async function auth ({ body }) {
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
      const e = new CreateError.BadRequest(error.message)
      return {
        statusCode: e.status,
        message: e.errorMessage
      }
    }
    if (error instanceof UnauthorizedError) {
      const e = new CreateError.Unauthorized(error.message)
      return {
        statusCode: e.status,
        message: e.errorMessage
      }
    } else {
      const e = new CreateError(StatusCodes.INTERNAL_SERVER_ERROR)
      return {
        statusCode: e.status,
        message: e.errorMessage
      }
    }
  }
}

module.exports = auth
