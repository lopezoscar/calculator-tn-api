const MongoClient = require('mongodb').MongoClient
const { StatusCodes } = require('http-status-codes')

const url = process.env.DB_CONN || process.env.MONGO_URL || 'mongodb://localhost:27017/calculator-db'
const dbName = process.env.DB || process.env.MONGO_DB || 'calculator-db'
const client = new MongoClient(url, { useUnifiedTopology: true })

let cachedDB

async function connect () {
  await client.connect()
  console.log('MongoDB Connected OK', url)
  return client.db(dbName)
}

async function connectToDatabase () {
  if (cachedDB) {
    console.log('=> using cached database instance')
    return Promise.resolve(cachedDB)
  }
  try {
    console.log('connecting to MongoDB')
    const db = await connect()
    cachedDB = db
    return cachedDB
  } catch (error) {
    console.log('Error in database connection', error)
    throw new Error({ statusCode: StatusCodes.INTERNAL_SERVER_ERROR })
  }
}

exports.getDB = function () {
  return cachedDB
}

exports.getClient = function () {
  return client
}

exports.connectToDatabase = connectToDatabase
