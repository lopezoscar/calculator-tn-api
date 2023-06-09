const Joi = require('joi')
const CreateError = require('http-errors')

const ValidationError = require('../errors/ValidationError')

const { StatusCodes } = require('http-status-codes')

const CalculatorService = require('../services/calculator-service')
const TooManyRequestsError = require('../errors/TooManyRequestsError')
const calculatorService = new CalculatorService()

const schema = Joi.object({
  operationType: Joi.string().valid('addition', 'subtraction', 'multiplication', 'division', 'square_root').required(),
  firstParam: Joi.number().required(),
  secondParam: Joi.number().required().when('operationType', { is: 'square_root', then: Joi.number().allow(null).optional() })
})

function validate (data) {
  const { error } = schema.validate(data)
  if (error) {
    throw new ValidationError(error)
  }
}

async function calculateBasic ({ userId, body }) {
  try {
    const params = body
    validate(params)
    const response = await calculatorService.calculateBasic({ userId, ...body })
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

module.exports = calculateBasic
