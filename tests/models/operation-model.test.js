const OperationModel = require('../../src/models/operation-model')
const { connectToDatabase, getClient } = require('../../src/db')

describe('OperationModel', () => {
  let operationModel
  let db
  beforeAll(async () => {
    db = await connectToDatabase()
    operationModel = new OperationModel()

    await db.collection('operations').insertMany([
      { type: 'addition', cost: 1 },
      { type: 'subtraction', cost: 1 },
      { type: 'multiplication', cost: 1 },
      { type: 'division', cost: 1 },
      { type: 'square_root', cost: 2 },
      { type: 'random_string', cost: 4 }
    ])
  })

  afterAll(async () => {
    await getClient().close()
  })

  describe('getOperationByType', () => {
    test('should the addition operation from db', async () => {
      const user = await operationModel.getOperationByType('addition')
      expect(user).toHaveProperty('_id')
      expect(user).toHaveProperty('type', 'addition')
    })
  })

  describe('getOperationByType', () => {
    test('should return null with an invalid operation', async () => {
      const user = await operationModel.getOperationByType('not_exists')
      expect(user).toBe(null)
    })
  })
})
