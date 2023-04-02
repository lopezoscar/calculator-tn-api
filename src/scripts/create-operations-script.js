const OPERATIONS_COLLECTION = 'operations'
const { connectToDatabase, getDB } = require('../db')

async function createOperations () {
  await connectToDatabase()
  const operations = await getDB().collection(OPERATIONS_COLLECTION).find({}).toArray()
  if (operations.length === 0) {
    const result = await getDB().collection(OPERATIONS_COLLECTION).insertMany([
      { type: 'addition', cost: 1 },
      { type: 'subtraction', cost: 1 },
      { type: 'multiplication', cost: 1 },
      { type: 'division', cost: 1 },
      { type: 'square_root', cost: 2 },
      { type: 'random_string', cost: 4 }
    ])
    console.log('operations created', result)
  }
}

createOperations()
