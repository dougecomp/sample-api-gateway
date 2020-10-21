import { MongoMemoryServer } from 'mongodb-memory-server'

import { makeServer } from './server'

const mongodb = new MongoMemoryServer()

describe('Server Test Suite', () => {
  it('should run server', async () => {
    process.env.MONGO_URL = await mongodb.getUri()
    const server = await makeServer()

    const response = await server.inject({
      method: 'POST',
      url: '/login',
      payload: {
        login: 'login',
        password: 'password'
      }
    })

    expect(response.statusCode).toBe(500)

    await server.stop()
    await mongodb.stop()
  })
})
