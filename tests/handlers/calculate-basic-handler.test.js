const calculateBasic = require('../../src/handlers/calculate-basic-handler')

jest.mock('../../src/services/calculator-service', () => {
  const TooManyRequestsError = require('../../src/errors/TooManyRequestsError')
  const InternalServerError = require('../../src/errors/InternalServerError')
  return jest.fn().mockImplementation(() => {
    return {
      calculateBasic: jest.fn().mockResolvedValueOnce({ operationResponse: 10 }).mockRejectedValueOnce(new TooManyRequestsError()).mockRejectedValueOnce(new InternalServerError())
    }
  })
})

describe('calculate-basic-handler', () => {
  test('should return statusCode 200 and a body with operationResponse 10 when run 5 + 5', async () => {
    const userId = '642999749f57ee9aa15d6fe9'
    const body = {
      operationType: 'addition',
      firstParam: 5,
      secondParam: 5
    }

    const response = await calculateBasic({ userId, body })

    expect(response).toStrictEqual({
      statusCode: 200,
      body: JSON.stringify({ operationResponse: 10 })
    })
  })

  test('should return statusCode 400 Bad Request when operationType is invalid', async () => {
    const userId = '642999749f57ee9aa15d6fe9'
    const body = {
      operationType: 'non_exist operation',
      firstParam: 20,
      secondParam: 10
    }

    const response = await calculateBasic({ userId, body })

    expect(response).toHaveProperty('statusCode', 400)
  })

  test('should return statusCode 429 Too Many requests if the user reached the quota', async () => {
    const userId = '642999749f57ee9aa15d6fe9'
    const body = {
      operationType: 'addition',
      firstParam: 20,
      secondParam: 10
    }

    const response = await calculateBasic({ userId, body })

    expect(response).toHaveProperty('statusCode', 429)
  })

  test('should return statusCode 500 when any other error arise', async () => {
    const userId = '642999749f57ee9aa15d6fe9'
    const body = {
      operationType: 'addition',
      firstParam: 20,
      secondParam: 10
    }

    const response = await calculateBasic({ userId, body })

    expect(response).toHaveProperty('statusCode', 500)
  })
})
