import { MongoMemoryServer } from 'mongodb-memory-server'

import { authenticationUseCase } from '.'
import { MongooseDatabaseConnection } from '../../providers/database/implementations/MongooseDatabaseConnection'
import { MongooseUserModel } from '../../repositories/implementations/MongooseUserModel'
import { MongooseUsersRepository } from '../../repositories/implementations/MongooseUsersRepository'

const mongod = new MongoMemoryServer()
const usersRepository = new MongooseUsersRepository()

describe('Authentication Use Case Test Suite', () => {
  beforeAll(async () => {
    const host = await mongod.getUri()
    const connection = new MongooseDatabaseConnection()
    await connection.connect({ host })
  })

  beforeEach(async () => {
    await usersRepository.deleteAll()
  })

  afterAll(async () => {
    await mongod.stop()
  })

  it('should authenticate with valid credentials and get jwt', async () => {
    await MongooseUserModel.create({
      name: 'Fulano Beltrano',
      email: 'fulano@beltrano.com',
      login: 'fulano',
      password: 'beltrano'
    })

    const { token, user } = await authenticationUseCase.execute({ login: 'fulano', password: 'beltrano' })

    expect(token).not.toBeNull()
    expect(user).not.toBeNull()
  })

  it('should NOT authenticate with invalid login', async () => {
    await MongooseUserModel.create({
      name: 'Fulano Beltrano',
      email: 'fulano@beltrano.com',
      login: 'fulano',
      password: 'beltrano'
    })

    const { token, user } = await authenticationUseCase.execute({ login: 'fulanu', password: 'beltrano' })

    expect(token).toBeNull()
    expect(user).toBeNull()
  })

  it('should NOT authenticate with invalid password', async () => {
    await MongooseUserModel.create({
      name: 'Fulano Beltrano',
      email: 'fulano@beltrano.com',
      login: 'fulano',
      password: 'beltrano'
    })

    const { token, user } = await authenticationUseCase.execute({ login: 'fulano', password: 'beltranu' })

    expect(token).toBeNull()
    expect(user).toBeNull()
  })

  it('should NOT authenticate unexistent user', async () => {
    const { token, user } = await authenticationUseCase.execute({ login: 'fulano', password: 'beltrano' })

    expect(token).toBeNull()
    expect(user).toBeNull()
  })
})
