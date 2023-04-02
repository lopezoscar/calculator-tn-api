const UserModel = require('../../src/models/user-model')
const { connectToDatabase, getClient } = require('../../src/db')
const mongodb = require('mongodb')

describe('UserModel', () => {
  let userModel
  let db
  beforeAll(async () => {
    db = await connectToDatabase()
    userModel = new UserModel()

    await db.collection('users').insertOne({
      _id: new mongodb.ObjectId('642999749f57ee9aa15d6fe9'),
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

  describe('getUserByUsername', () => {
    test('should return a user from db', async () => {
      const user = await userModel.getUserByUsername('lopezoscar')
      expect(user).toHaveProperty('_id')
    })

    test('should return null if the username not exists', async () => {
      const user = await userModel.getUserByUsername('user_not_exists')
      expect(user).toBe(null)
    })
  })

  describe('getUserById', () => {
    test('should return a user from db by userId', async () => {
      const user = await userModel.getUserById('642999749f57ee9aa15d6fe9')
      expect(user).toHaveProperty('_id')
      expect(user._id.toString()).toBe('642999749f57ee9aa15d6fe9')
    })

    test('should return null if the username not exists', async () => {
      const user = await userModel.getUserById('642999749f57ee9aa15d6fe1')
      expect(user).toBe(null)
    })
  })

  describe('saveUser', () => {
    test('should return a new user on save', async () => {
      const newUser = {
        username: 'lopezoscar',
        status: 'ACTIVE',
        balance: 100,
        createdAt: new Date()
      }
      const { insertedId } = await userModel.saveUser({ newUser })
      expect(insertedId).toBeDefined()
    })
  })

  describe('decrementUserBalance', () => {
    test('should update the balance in a user', async () => {
      const userId = '642999749f57ee9aa15d6fe9'
      await userModel.decrementUserBalance({ userId, cost: 5 })
      const user = await userModel.getUserById(userId)
      expect(user?.balance).toBe(75)
    })
  })
})
