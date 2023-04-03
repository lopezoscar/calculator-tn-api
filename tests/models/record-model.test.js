const RecordModel = require('../../src/models/record-model')
const { connectToDatabase, getClient } = require('../../src/db')

describe('RecordModel', () => {
  let recordModel
  let db
  beforeAll(async () => {
    db = await connectToDatabase()
    recordModel = new RecordModel()
    db.collection('records').insertMany([
      {
        operation: 'division',
        operationResponse: 10,
        firstParam: 10,
        secondParam: 1,
        userId: '642999749f57ee9aa15d6fe9',
        active: true,
        date: '2023-04-02T22:56:29.155Z'
      },
      {
        operation: 'addition',
        operationResponse: 20,
        firstParam: 10,
        secondParam: 10,
        userId: '642999749f57ee9aa15d6fe9',
        active: true,
        date: '2023-04-03T22:56:29.155Z'
      }
    ])
  })

  afterAll(async () => {
    await getClient().close()
  })

  describe('listRecordsByUserId', () => {
    test('should list active records from a user', async () => {
      const params = {
        userId: '642999749f57ee9aa15d6fe9',
        page: 1,
        limit: 5,
        sort: 'desc_date'
      }
      const records = await recordModel.listRecordsByUserId(params)
      expect(records).toHaveLength(2)
    })

    test('should return an empty list when a user doesnt have records', async () => {
      const params = {
        userId: '642999749f57ee9aa15d6fe8',
        page: 1,
        limit: 5,
        sort: 'desc_date'
      }
      const records = await recordModel.listRecordsByUserId(params)
      expect(records).toHaveLength(0)
    })
  })

  describe('saveRecord', () => {
    test('should insert a record successfuly', async () => {
      const newRecord = {
        operation: 'addition',
        operationResponse: 20,
        firstParam: 10,
        secondParam: 10,
        userId: '642999749f57ee9aa15d6fe9',
        active: true,
        date: '2023-04-03T22:56:29.155Z'
      }
      const result = await recordModel.saveRecord(newRecord)
      expect(result).toHaveProperty('insertedId')
    })
  })

  describe('getRecordById', () => {
    test('should get a record by id', async () => {
      const newRecord = {
        operation: 'addition',
        operationResponse: 20,
        firstParam: 10,
        secondParam: 10,
        userId: '642999749f57ee9aa15d6fe9',
        active: true,
        date: '2023-04-03T22:56:29.155Z'
      }
      const result = await recordModel.saveRecord(newRecord)

      const record = await recordModel.getRecordById(result.insertedId)

      expect(record).toHaveProperty('_id', result.insertedId)
    })

    test('should return null if record not exists', async () => {
      const nonExistRecordId = '642999749f57ee9aa15d6fe1'
      const record = await recordModel.getRecordById(nonExistRecordId)

      expect(record).toBe(null)
    })
  })

  describe('deleteRecord', () => {
    test('should delete a record using recordId and userId', async () => {
      const newRecord = {
        operation: 'addition',
        operationResponse: 20,
        firstParam: 10,
        secondParam: 10,
        userId: '642999749f57ee9aa15d6fe9',
        active: true,
        date: '2023-04-03T22:56:29.155Z'
      }
      const { insertedId } = await recordModel.saveRecord(newRecord)

      const result = await recordModel.deleteRecord({ userId: newRecord.userId, recordId: insertedId })
      const deleted = Boolean(result?.lastErrorObject?.updatedExisting)
      expect(deleted).toBe(true)
    })
  })
})
