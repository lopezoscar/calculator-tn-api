const ValidationError = require('../errors/ValidationError')
const InternalServerError = require('../errors/InternalServerError')
const TooManyRequestsError = require('../errors/TooManyRequestsError')

const RecordModel = require('../models/record-model')
const UserModel = require('../models/user-model')
const OperationModel = require('../models/operation-model')

const RandomLib = require('../lib/random-lib')

class CalculatorService {
  constructor () {
    this.recordModel = new RecordModel()
    this.userModel = new UserModel()
    this.operationModel = new OperationModel()
    this.randomLib = new RandomLib()

    this.basicOperations = {
      addition: (a, b) => a + b,
      subtraction: (a, b) => a - b,
      multiplication: (a, b) => a * b,
      division: (a, b) => {
        if (b !== 0) {
          return a / b
        }
        throw new ValidationError('division by zero is not allowed')
      },
      square_root: (a) => Math.sqrt(a)
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
      active: true,
      date: new Date()
    }

    try {
      await this._storeRecord(newRecord)
      await this.userModel.decrementUserBalance({ userId, cost: operation.cost })

      return { operationResponse }
    } catch (error) {
      console.log(error)
      throw new InternalServerError('error calculating operation')
    }
  }

  async calculateRandom ({ userId, length }) {
    const operation = await this.operationModel.getOperationByType('random_string')

    await this._checkUserBalance({ userId, cost: operation.cost })

    const randomString = await this.randomLib.getRandom({ length })

    if (!randomString) {
      throw new InternalServerError('cannot calculate a random string')
    }

    const newRecord = {
      operation: 'random_string',
      userId,
      operationResponse: randomString,
      active: true,
      date: new Date()
    }

    try {
      await this._storeRecord(newRecord)
      await this.userModel.decrementUserBalance({ userId, cost: operation.cost })

      return { operationResponse: randomString }
    } catch (error) {
      console.log(error)
      throw new InternalServerError('error calculating operation')
    }
  }

  async _storeRecord (newRecord) {
    const { insertedId } = await this.recordModel.saveRecord(newRecord)
    if (!insertedId) {
      throw new Error('error storing record in DB')
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
