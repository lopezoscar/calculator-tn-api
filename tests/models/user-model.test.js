const UserModel = require('../../src/models/user-model')
const { connectToDatabase, getClient } = require('../../src/db')
describe('UserModel', () => {
  let userModel
  let db
  beforeAll(async () => {
    db = await connectToDatabase()
    userModel = new UserModel()
  })

  describe('getUserByUsername', () => {
    beforeAll(async () => {
      await db.collection('users').insertOne({
        username: 'lopezoscar',
        status: 'ACTIVE',
        balance: 80,
        createdAt: new Date(),
        password: '$2a$10$tEs6vKv.9SrBHCjDDQQL6uRfvuOHJBJNoqOfQQ643Dqsn2J0TzS..'
      })
    })
    afterAll(async () => {
      await getClient().close()
    })
    test('should return a user from db', async () => {
      const user = await userModel.getUserByUsername('lopezoscar')
      expect(user).toHaveProperty('_id')
    })

    test('should return null if the username not exists', async () => {
      const user = await userModel.getUserByUsername('user_not_exists')
      expect(user).toBe(null)
    })
  })
})
