const RecordsModel = require('../models/record-model')

class RecordService {
  constructor () {
    this.recordsModel = new RecordsModel()
  }

  listRecordsByUserId ({ userId, page, limit, sort }) {
    page = Number(page)
    limit = Number(limit)
    return this.recordsModel.listRecordsByUserId({ userId, page, limit, sort })
  }
}

module.exports = RecordService
