const RECORDS_COLLECTION = 'records'
const { getDB } = require('../db')
const mongodb = require('mongodb')

class RecordModel {
  saveRecord (record) {
    return getDB().collection(RECORDS_COLLECTION).insertOne(record)
  }

  listRecordsByUserId ({ userId, page, limit, sort = 'desc_date' }) {
    return getDB()
      .collection(RECORDS_COLLECTION)
      .find({ userId, active: true })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(this._parseSort(sort))
      .toArray()
  }

  getRecordById (recordId) {
    return getDB()
      .collection(RECORDS_COLLECTION)
      .findOne({ _id: new mongodb.ObjectId(recordId) })
  }

  deleteRecord ({ userId, recordId }) {
    const query = { _id: new mongodb.ObjectId(recordId), userId }
    const update = { $set: { active: false } }
    return getDB().collection(RECORDS_COLLECTION).findOneAndUpdate(query, update)
  }

  _parseSort (sortAsString) {
    if (sortAsString.length === 0) {
      return {}
    }
    const sortParams = sortAsString.split(',')

    const sort = sortParams.reduce((sort, param) => {
      const isAsc = param.indexOf('asc_') === 0
      const field = param.split(isAsc ? 'asc_' : 'desc_').pop()
      sort[field] = isAsc ? 1 : -1
      return sort
    }, {})

    console.log('sort', sort)
    return sort
  }
}

module.exports = RecordModel
