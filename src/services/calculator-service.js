const ValidationError = require('../errors/ValidationError')
const InternalServerError = require('../errors/InternalServerError')

const RecordModel = require('../models/record-model')
const UserModel = require('../models/user-model')
const OperationModel = require('../models/operation-model')
const TooManyRequestsError = require('../errors/TooManyRequestsError')

class CalculatorService {
  constructor () {
    this.recordModel = new RecordModel()
    this.userModel = new UserModel()
    this.operationModel = new OperationModel()

    this.basicOperations = {
      addition: (a, b) => a + b,
      subtraction: (a, b) => a - b,
      multiplication: (a, b) => a * b,
      division: (a, b) => a / b
    }
  }

  async calculateBasic ({ userId, operationType, firstParam, secondParam }) {
    if (!this.basicOperations[operationType]) {
      throw new ValidationError('invalid operation')
    }

    const operation = await this.operationModel.getOperationByType(operationType)

    await this._checkUserBalance({ userId, cost: operation.cost })

    const operationResponse = this.basicOperations[operationType](firstParam, secondParam)
    const newRecord = {
      operation: operationType,
      operationResponse,
      firstParam,
      secondParam,
      userId,
      date: new Date()
    }
    try {
      const { insertedId } = await this.recordModel.saveRecord(newRecord)
      if (!insertedId) {
        throw new Error('error storing record in DB')
      }

      await this.userModel.decrementUserBalance({ userId, cost: operation.cost })

      return { operationResponse }
    } catch (error) {
      console.log(error)
      throw new InternalServerError('error calculating operation')
    }
  }

  async _checkUserBalance ({ userId, cost }) {
    let user

    try {
      user = await this.userModel.getUserById(userId)
    } catch (error) {
      console.log(error)
      throw new InternalServerError(`cannot get user by id ${userId}`)
    }
    if (user.balance < cost) {
      throw new TooManyRequestsError('not enough balance')
    }
  }
}

module.exports = CalculatorService
