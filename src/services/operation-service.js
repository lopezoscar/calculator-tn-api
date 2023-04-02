const OperationModel = require('../models/operation-model')
const OPERATIONS = {
  ADDITION: 'addition',
  SUBTRACTION: 'subtraction',
  MULTIPLICATION: 'multiplication',
  DIVISION: 'division',
  SQUARE_ROOT: 'square_root',
  RANDOM_STRING: 'random_string'
}
class OperationService {
  constructor () {
    this.operationModel = new OperationModel()
  }
}

module.exports = OperationService
