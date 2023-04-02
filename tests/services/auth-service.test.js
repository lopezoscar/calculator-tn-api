const AuthService = require('../../src/services/auth-service')
const { comparePasswords } = require('../../src/lib/security-lib')

jest.mock('../../src/models/user-model', () => {
  return jest.fn().mockImplementation(() => {
    return {
      saveUser: jest.fn().mockResolvedValue({ insertedId: '642999749f57ee9aa15d6fe9' }),
      getUserByUsername: jest.fn()
        .mockResolvedValueOnce(
          {
            _id: '642999749f57ee9aa15d6fe9',
            username: 'lopezoscar',
            status: 'ACTIVE',
            balance: 80,
            createdAt: '2023-04-02T15:04:19.966Z',
            password: '$2a$10$tEs6vKv.9SrBHCjDDQQL6uRfvuOHJBJNoqOfQQ643Dqsn2J0TzS..'
          }
        )
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(
          {
            _id: '642999749f57ee9aa15d6fe9',
            username: 'lopezoscar',
            status: 'ACTIVE',
            balance: 80,
            createdAt: '2023-04-02T15:04:19.966Z',
            password: '$2a$10$tEs6vKv.9SrBHCjDDQQL6uRfvuOHJBJNoqOfQQ643Dqsn2J0TzS..'
          }
        )
    }
  })
})

const JWT_TOKEN_SUCCESS = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDI5OTk3NDlmNTdlZTlhYTE1ZDZmZTkiLCJpYXQiOjE2ODA0NTY4MjIsImV4cCI6MTY4MDQ2MDQyMn0.rBd54rbl9QWCQa9nQl2I3KPZFXSO1C6XPVq7-ejQFyQ'
jest.mock('../../src/lib/token-lib', () => (
  {
    ...(jest.requireActual('../../src/lib/token-lib')),
    createToken: jest.fn().mockResolvedValue(JWT_TOKEN_SUCCESS)
  }
))

jest.mock('../../src/lib/security-lib', () => (
  {
    ...(jest.requireActual('../../src/lib/security-lib')),
    comparePasswords: jest.fn(),
    hashPassword: jest.fn()
  }
))

describe('AuthService', () => {
  let authService

  beforeAll(() => {
    authService = new AuthService()
  })

  describe('auth', () => {
    test('should return an access token for valid credentials', async () => {
      comparePasswords.mockResolvedValue(true)

      const credentials = {
        username: 'lopezoscar',
        password: 'calculator1234'
      }

      const response = await authService.auth(credentials)

      expect(response).toBe(JWT_TOKEN_SUCCESS)
    })

    test('should return an error with user not found with invalid credentials', async () => {
      const credentials = {
        username: 'lopezoscarNotExists',
        password: 'calculator1234'
      }

      try {
        await authService.auth(credentials)
      } catch (error) {
        expect(error.message).toMatch('INVALID_LOGIN')
      }
    })

    test('should return an error with an invalid password', async () => {
      comparePasswords.mockResolvedValue(false)

      const credentials = {
        username: 'lopezoscar',
        password: 'INVALID PASSWORD'
      }

      try {
        await authService.auth(credentials)
      } catch (error) {
        console.log('tet', error)
        expect(error.message).toMatch('INVALID_LOGIN')
      }
    })
  })

  describe('register', () => {
    test('should register a user', async () => {
      const newUser = {
        username: 'lopezoscar',
        password: 'calculator1234'
      }

      const result = await authService.register(newUser)
      console.log('result', result)
      expect(result).toHaveProperty('accessToken')
    })
  })
})
