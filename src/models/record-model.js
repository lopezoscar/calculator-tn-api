const RECORDS_COLLECTION = 'records'
const { getDB } = require('../db')

class RecordModel {
  saveRecord (record) {
    return getDB().collection(RECORDS_COLLECTION).insertOne(record)
  }
}

module.exports = RecordModel
