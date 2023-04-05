const NotFoundError = require('../errors/NotFoundError')
const UnauthorizedError = require('../errors/UnauthorizedError')
const RecordsModel = require('../models/record-model')

class RecordService {
  constructor () {
    this.recordModel = new RecordsModel()
  }

  async listRecordsByUserId ({ userId, page, limit, sort }) {
    console.log('listRecordsByUserId', userId, page, limit, sort)
    page = Number(page)
    limit = Number(limit)
    const response = await this.recordModel.listRecordsByUserId({ userId, page, limit, sort })
    return response
  }

  async deleteRecord ({ userId, recordId }) {
    const record = await this.recordModel.getRecordById(recordId)
    if (!record) {
      console.log('record with this id doesnt exist')
      throw new NotFoundError('record not found')
    }
    if (!record.active) {
      console.log('inactive record')
      throw new NotFoundError('record not found')
    }
    if (record.userId !== userId) {
      throw new UnauthorizedError(`this record ${recordId} doesnt belong to this userId ${userId}`)
    }
    const result = await this.recordModel.deleteRecord({ userId, recordId })
    return {
      deleted: Boolean(result?.lastErrorObject?.updatedExisting)
    }
  }
}

module.exports = RecordService
