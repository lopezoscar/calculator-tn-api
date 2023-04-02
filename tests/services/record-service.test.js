const RecordService = require('../../src/services/record-service')

jest.mock('../../src/models/record-model', () => {
  return jest.fn().mockImplementation(() => {
    return {
      listRecordsByUserId: jest.fn().mockResolvedValue([]),
      getRecordById: jest.fn()
        .mockResolvedValueOnce({
          _id: '6429bf44833e14453f050171',
          operation: 'random_string',
          userId: '642999749f57ee9aa15d6fe9',
          operationResponse: '8Gp',
          active: true,
          date: '2023-04-02T17:45:40.845Z'
        })
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({
          _id: '6429bf44833e14453f050171',
          operation: 'random_string',
          userId: '642999749f57ee9aa15d6fe9',
          operationResponse: '8Gp',
          active: false,
          date: '2023-04-02T17:45:40.845Z'
        })
        .mockResolvedValueOnce({
          _id: '6429bf44833e14453f050171',
          operation: 'random_string',
          userId: '6429bf44833e14453f050171', // OTHER USER ID
          operationResponse: '8Gp',
          active: true,
          date: '2023-04-02T17:45:40.845Z'
        }),
      deleteRecord: jest.fn().mockResolvedValue({
        lastErrorObject: {
          updatedExisting: true
        }
      })
    }
  })
})

describe('RecordService', () => {
  let recordService
  beforeAll(() => {
    recordService = new RecordService()
  })
  describe('listRecordsByUserId', () => {
    test('shoud list records by id', async () => {
      const userId = '642999749f57ee9aa15d6fe9'
      const page = '1'
      const limit = '10'
      const sort = null

      const records = await recordService.listRecordsByUserId({ userId, page, limit, sort })
      expect(records).toBeDefined()
    })
  })

  describe('deleteRecord', () => {
    test('should delete a record by userId and recordId', async () => {
      const userId = '642999749f57ee9aa15d6fe9'
      const recordId = '6429bf44833e14453f050171'

      const response = await recordService.deleteRecord({ userId, recordId })
      expect(response).toEqual({ deleted: true })
    })

    test('should fail when a record not exists', async () => {
      const userId = '642999749f57ee9aa15d6fe9'
      const recordId = '700000000000000000000'

      try {
        await recordService.deleteRecord({ userId, recordId })
      } catch (error) {
        expect(error.message).toMatch('record not found')
      }
    })

    test('should fail when a record is not active', async () => {
      const userId = '642999749f57ee9aa15d6fe9'
      const recordId = '700000000000000000000'

      try {
        await recordService.deleteRecord({ userId, recordId })
      } catch (error) {
        expect(error.message).toMatch('record not found')
      }
    })

    test('should fail when a record doesnt belong to this user', async () => {
      const userId = '642999749f57ee9aa15d6fe9'
      const recordId = '6429bf44833e14453f050171'

      try {
        await recordService.deleteRecord({ userId, recordId })
      } catch (error) {
        expect(error.message).toMatch('doesnt belong to this userId')
      }
    })
  })
})
