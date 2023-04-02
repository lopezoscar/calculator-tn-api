const OPERATIONS_COLLECTION = 'operations'
const { getDB } = require('../db')

class OperationModel {
  getOperationByType (type) {
    return getDB().collection(OPERATIONS_COLLECTION).findOne({ type })
  }
}

module.exports = OperationModel
