const ValidationError = require('../errors/ValidationError')
const InternalServerError = require('../errors/InternalServerError')

const RecordModel = require('../models/record-model')

class CalculatorService {
  constructor () {
    this.recordModel = new RecordModel()
    this.basicOperations = {
      addition: (a, b) => a + b,
      subtraction: (a, b) => a - b,
      multiplication: (a, b) => a * b,
      division: (a, b) => a / b
    }
  }

  async calculateBasic ({ operationType, firstParam, secondParam }) {
    if (!this.basicOperations[operationType]) {
      throw new ValidationError('invalid operation')
    }
    const operationResponse = this.basicOperations[operationType](firstParam, secondParam)
    const newRecord = {
      operation: operationType,
      operationResponse,
      firstParam,
      secondParam,
      date: new Date()
    }
    try {
      const { insertedId } = await this.recordModel.saveRecord(newRecord)
      if (!insertedId) {
        throw new Error('error storing record in DB')
      }
      return { operationResponse }
    } catch (error) {
      console.log(error)
      throw new InternalServerError('error calculating operationt')
    }
  }
}

module.exports = CalculatorService
