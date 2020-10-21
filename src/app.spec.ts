import { Server } from '@hapi/hapi'
import { MongoMemoryServer } from 'mongodb-memory-server'

import { makeApp } from './app'
import { MongooseDatabaseConnection } from './providers/database/implementations/MongooseDatabaseConnection'
import { MongooseUsersRepository } from './repositories/implementations/MongooseUsersRepository'
import { User } from './entities/User'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000

let app: Server

const mongodb = new MongoMemoryServer()
const mongodbConnection = new MongooseDatabaseConnection()
const usersRepository = new MongooseUsersRepository()

describe('Application Test Suite', () => {
  beforeAll(async () => {
    const host = await mongodb.getUri()
    await mongodbConnection.connect({ host })
    app = await makeApp()
  })
  afterEach(async () => {
    await usersRepository.deleteAll()
  })
  afterAll(async () => {
    await mongodbConnection.disconnect()
    await mongodb.stop()
    await app.stop()
  })

  it('should authenticate user with valid credentials retrieving user data and token', async () => {
    const user = new User({
      name: 'Fulano',
      email: 'fulano@email.com',
      login: 'fulano',
      password: 'beltrano'
    })

    await usersRepository.save(user)

    const response = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {
        login: 'fulano',
        password: 'beltrano'
      }
    })
    const payload = JSON.parse(response.payload)

    expect(response.statusCode).toBe(200)
    expect(payload.user).not.toBeNull()
    expect(payload.token).not.toBeNull()
  })

  it('should deny access to a protected route when token not provided', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/users',
      payload: {
        name: 'Fulano Silva',
        email: 'fulano@email.com',
        login: 'fulano',
        password: 'beltrano'
      }
    })

    expect(response.statusCode).toBe(401)
  })

  it('should deny access to a protected route when token is invalid', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/users',
      payload: {
        name: 'Fulano Silva',
        email: 'fulano@email.com',
        login: 'fulano',
        password: 'beltrano'
      },
      headers: {
        Auhtorization: 'Bearer abcdef123456'
      }
    })
    expect(response.statusCode).toBe(401)
  })

  it('should allow access to the protected route GET /users after login and create user', async () => {
    const user = new User({
      name: 'Fulano',
      email: 'fulano@email.com',
      login: 'fulano',
      password: 'beltrano'
    })

    await usersRepository.save(user)

    const loginResponse = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {
        login: 'fulano',
        password: 'beltrano'
      }
    })
    const { token } = JSON.parse(loginResponse.payload)

    const response = await app.inject({
      method: 'POST',
      url: '/users',
      payload: {
        name: 'Cicrano Moraes',
        email: 'cicrano@email.com',
        login: 'cicrano',
        password: 'cicranopassword'
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    expect(response.statusCode).toBe(201)
  })

  it('should allow access to the protected route POST /users after login but user create fails with invalid payload', async () => {
    const user = new User({
      name: 'Fulano',
      email: 'fulano@email.com',
      login: 'fulano',
      password: 'beltrano'
    })

    await usersRepository.save(user)

    const loginResponse = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {
        login: 'fulano',
        password: 'beltrano'
      }
    })
    const { token } = JSON.parse(loginResponse.payload)

    const response = await app.inject({
      method: 'POST',
      url: '/users',
      payload: {
        name: '',
        email: '',
        login: 'cicrano',
        password: ''
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    expect(response.statusCode).toBe(400)
  })

  it('should allow access to the protected route GET /users after login and get users', async () => {
    const user = new User({
      name: 'Fulano',
      email: 'fulano@email.com',
      login: 'fulano',
      password: 'beltrano'
    })

    await usersRepository.save(user)

    const loginResponse = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {
        login: 'fulano',
        password: 'beltrano'
      }
    })
    const { token } = JSON.parse(loginResponse.payload)

    const response = await app.inject({
      method: 'GET',
      url: '/users',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.payload).users).toHaveLength(1)
  })

  it('should allow access to the protected route DELETE /users after login and delete user', async () => {
    const user = new User({
      name: 'Fulano',
      email: 'fulano@email.com',
      login: 'fulano',
      password: 'beltrano'
    })

    await usersRepository.save(user)

    const loginResponse = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {
        login: 'fulano',
        password: 'beltrano'
      }
    })
    const { token } = JSON.parse(loginResponse.payload)

    const response = await app.inject({
      method: 'DELETE',
      url: '/users/fulano',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.payload).deleted).toBe(true)
  })

  it('should allow access to the protected route PUT /users after login and update user', async () => {
    const user = new User({
      name: 'Fulano',
      email: 'fulano@email.com',
      login: 'fulano',
      password: 'beltrano'
    })

    await usersRepository.save(user)

    const loginResponse = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {
        login: 'fulano',
        password: 'beltrano'
      }
    })
    const { token } = JSON.parse(loginResponse.payload)

    const response = await app.inject({
      method: 'PUT',
      url: '/users/fulano',
      payload: {
        name: 'Fulannnuuuu',
        email: 'Fulannnuuuu@email.com',
        password: 'fulano'
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.payload).saved).toBe(true)
  })

  it('should allow access to the protected route PUT /users after login but user update fail with invalid payload', async () => {
    const user = new User({
      name: 'Fulano',
      email: 'fulano@email.com',
      login: 'fulano',
      password: 'beltrano'
    })

    await usersRepository.save(user)

    const loginResponse = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {
        login: 'fulano',
        password: 'beltrano'
      }
    })
    const { token } = JSON.parse(loginResponse.payload)

    const response = await app.inject({
      method: 'PUT',
      url: '/users/fulano',
      payload: {
        name: ''
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    expect(response.statusCode).toBe(400)
  })
})
