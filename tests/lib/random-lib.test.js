const RandomLib = require('../../src/lib/random-lib')
const axios = require('axios')

jest.mock('axios')

describe('RandomLib', () => {
  let randomLib
  beforeAll(() => {
    randomLib = new RandomLib()
  })

  describe('getRandom', () => {
    test('should return a random string of length 3', async () => {
      axios.post.mockResolvedValue({
        data: {
          result: {
            random: { data: ['ABC'] }
          }
        }
      })
      const randomString = await randomLib.getRandom({ length: 3 })
      expect(randomString).toHaveLength(3)
    })
  })
})
