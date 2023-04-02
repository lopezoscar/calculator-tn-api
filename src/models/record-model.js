const RECORDS_COLLECTION = 'records'
const { getDB } = require('../db')

class RecordModel {
  saveRecord (record) {
    return getDB().collection(RECORDS_COLLECTION).insertOne(record)
  }

  listRecordsByUserId ({ userId, page, limit, sort = 'desc_date' }) {
    return getDB()
      .collection(RECORDS_COLLECTION)
      .find({ userId })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(this._parseSort(sort))
      .toArray()
  }

  _parseSort (sortAsString) {
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
