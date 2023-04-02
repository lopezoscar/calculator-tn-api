const CalculatorService = require('../../src/services/calculator-service')

jest.mock('../../src/models/record-model', () => {
  return jest.fn().mockImplementation(() => {
    return {
      saveRecord: jest.fn().mockResolvedValue({ insertedId: '942999749f57ee9aa15d6fe9' })
    }
  })
})

jest.mock('../../src/models/user-model', () => {
  return jest.fn().mockImplementation(() => {
    return {
      getUserById: jest.fn().mockResolvedValue({
        _id: '642999749f57ee9aa15d6fe9',
        username: 'lopezoscar',
        status: 'ACTIVE',
        balance: 80,
        createdAt: '2023-04-02T15:04:19.966Z'
      }),
      decrementUserBalance: jest.fn().mockResolvedValue()
    }
  })
})

jest.mock('../../src/models/operation-model', () => {
  return jest.fn().mockImplementation(() => {
    return {
      getOperationByType: jest.fn().mockResolvedValue({
        _id: '64299b611f5d08c0643e77e7',
        type: 'addition',
        cost: 1
      })
    }
  })
})

jest.mock('../../src/lib/random-lib', () => {
  return jest.fn().mockImplementation(() => {
    return {
      getRandom: jest.fn().mockResolvedValueOnce('ABCDE').mockResolvedValueOnce(null)
    }
  })
})

describe('CalculatorService', () => {
  let calculatorService

  beforeAll(() => {
    calculatorService = new CalculatorService()
  })

  describe('calculateBasic', () => {
    test('addition - should return operationResponse 10 if it run 5 + 5', async () => {
      const params = {
        userId: '642999749f57ee9aa15d6fe9',
        operationType: 'addition',
        firstParam: 5,
        secondParam: 5
      }
      const result = await calculatorService.calculateBasic(params)

      expect(result).toStrictEqual({ operationResponse: 10 })
    })

    test('subtraction - should return operationResponse 0 if it run 5 - 5', async () => {
      const params = {
        userId: '642999749f57ee9aa15d6fe9',
        operationType: 'subtraction',
        firstParam: 5,
        secondParam: 5
      }
      const result = await calculatorService.calculateBasic(params)

      expect(result).toStrictEqual({ operationResponse: 0 })
    })

    test('multiplication - should return operationResponse 25 if it run 5 * 5', async () => {
      const params = {
        userId: '642999749f57ee9aa15d6fe9',
        operationType: 'multiplication',
        firstParam: 5,
        secondParam: 5
      }
      const result = await calculatorService.calculateBasic(params)

      expect(result).toStrictEqual({ operationResponse: 25 })
    })

    test('division - should return operationResponse 1 if it run 5 / 5', async () => {
      const params = {
        userId: '642999749f57ee9aa15d6fe9',
        operationType: 'division',
        firstParam: 5,
        secondParam: 5
      }
      const result = await calculatorService.calculateBasic(params)

      expect(result).toStrictEqual({ operationResponse: 1 })
    })

    test('square_root - should return operationResponse 5 if it run square root of 25', async () => {
      const params = {
        userId: '642999749f57ee9aa15d6fe9',
        operationType: 'square_root',
        firstParam: 25
      }
      const result = await calculatorService.calculateBasic(params)

      expect(result).toStrictEqual({ operationResponse: 5 })
    })

    test('division - should return Validation Error in division by 0', async () => {
      const params = {
        userId: '642999749f57ee9aa15d6fe9',
        operationType: 'division',
        firstParam: 5,
        secondParam: 0
      }

      try {
        await calculatorService.calculateBasic(params)
      } catch (error) {
        expect(error.message).toMatch('division by zero is not allowed')
      }
    })

    test('should return invalid operation if the operationType is invalid', async () => {
      const params = {
        userId: '642999749f57ee9aa15d6fe9',
        operationType: 'division_not_exist',
        firstParam: 5,
        secondParam: 0
      }

      try {
        await calculatorService.calculateBasic(params)
      } catch (error) {
        expect(error.message).toMatch('invalid operation')
      }
    })
  })

  describe('calculateRandom', () => {
    test('should return a random string with length 5', async () => {
      const userId = '642999749f57ee9aa15d6fe9'
      const length = 5
      const result = await calculatorService.calculateRandom({ userId, length })

      expect(result).toHaveProperty('operationResponse')
      expect(result.operationResponse.length).toBe(length)
    })

    test('should return internal server error when random.org is not working.', async () => {
      const userId = '642999749f57ee9aa15d6fe9'
      const length = 5

      try {
        await calculatorService.calculateRandom({ userId, length })
      } catch (error) {
        expect(error.message).toMatch('cannot calculate a random string')
      }
    })
  })
})
