const Joi = require('joi')
const CreateError = require('http-errors')

const ValidationError = require('../errors/ValidationError')
const UnauthorizedError = require('../errors/UnauthorizedError')

const { StatusCodes } = require('http-status-codes')

const RecordService = require('../services/record-service')
const NotFoundError = require('../errors/NotFoundError')
const recordService = new RecordService()

const schema = Joi.object({
  recordId: Joi.string().required()
})

function validate (data) {
  const { error } = schema.validate(data)
  if (error) {
    throw new ValidationError(error)
  }
}

async function deleteRecord ({ userId, body }) {
  try {
    const params = body
    validate(params)
    const response = await recordService.deleteRecord({ userId, ...body })
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
    if (error instanceof NotFoundError) {
      const e = new CreateError.NotFound(error.message)
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

module.exports = deleteRecord
