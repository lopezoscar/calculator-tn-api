const axios = require('axios')
const { v4: uuid } = require('uuid')
const RANDOM_ORG_REQUEST_TIMEOUT = 5000 // timeout 5s

class RandomLib {
  constructor () {
    this.randomAPI = axios.create({
      baseURL: 'https://api.random.org'
    })
  }

  async getRandom ({ length = 1 }) {
    const body = {
      jsonrpc: '2.0',
      method: 'generateStrings',
      params: {
        apiKey: process.env.RANDOM_ORG_API_KEY,
        n: 1,
        length,
        characters: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&*',
        replacement: true,
        pregeneratedRandomization: null
      },
      id: uuid()
    }
    const response = await Promise.race([
      this.randomAPI.post('/json-rpc/4/invoke', body),
      new Promise((resolve, reject) => { setTimeout(resolve, RANDOM_ORG_REQUEST_TIMEOUT) })
    ])
    console.log('response', JSON.stringify(response?.data, null, 4))
    return response?.data?.result?.random?.data?.pop()
  }
}

module.exports = RandomLib
