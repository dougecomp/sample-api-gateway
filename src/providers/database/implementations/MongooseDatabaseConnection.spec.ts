import { MongooseDatabaseConnection } from './MongooseDatabaseConnection'

import { MongoMemoryServer } from 'mongodb-memory-server'

const mongodb = new MongoMemoryServer()
describe('Mongoose Database Connection Test Suite', () => {
  it('should connect to a mongoose database', async () => {
    const host = await mongodb.getUri()
    const mongooseDatabaseConnection = new MongooseDatabaseConnection()
    const connected = await mongooseDatabaseConnection.connect({ host })

    expect(connected).toBe(true)

    await mongooseDatabaseConnection.disconnect()
  })

  it('should return database connection error', async () => {
    const mongooseDatabaseConnection = new MongooseDatabaseConnection()
    const connected = await mongooseDatabaseConnection.connect({ host: 'http://invaliddatabaseurl' })

    expect(connected).toBe(false)

    await mongooseDatabaseConnection.disconnect()
  })
})
