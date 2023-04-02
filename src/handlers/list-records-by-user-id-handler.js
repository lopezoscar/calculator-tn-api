const Joi = require('joi')
const CreateError = require('http-errors')

const ValidationError = require('../errors/ValidationError')
const UnauthorizedError = require('../errors/UnauthorizedError')

const { StatusCodes } = require('http-status-codes')

const OperationService = require('../services/record-service')
const TooManyRequestsError = require('../errors/TooManyRequestsError')
const operationService = new OperationService()

const schema = Joi.object({
  page: Joi.number().min(1).max(100).required(),
  limit: Joi.number().min(1).max(100).required(),
  sort: Joi.string().optional().allow(null)
})

function validate (data) {
  const { error } = schema.validate(data)
  if (error) {
    throw new ValidationError(error)
  }
}

async function listRecordsByUserId ({ userId, queryStringParameters }) {
  console.log('queryStringParameters', queryStringParameters)
  try {
    const params = queryStringParameters
    validate(params)
    const response = await operationService.listRecordsByUserId({ userId, ...params })
    return {
      statusCode: StatusCodes.OK,
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
    }
    if (error instanceof TooManyRequestsError) {
      const e = new CreateError.TooManyRequests(error.message)
      return {
        statusCode: e.status,
        message: e.errorMessage
      }
    }
    const e = new CreateError(StatusCodes.INTERNAL_SERVER_ERROR)
    return {
      statusCode: e.status,
      message: e.errorMessage
    }
  }
}

module.exports = listRecordsByUserId
