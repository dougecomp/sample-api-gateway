import { MongoMemoryServer } from 'mongodb-memory-server'

import { createUserUseCase } from '.'
import { MongooseDatabaseConnection } from '../../../providers/database/implementations/MongooseDatabaseConnection'
import { MongooseUserModel } from '../../../repositories/implementations/MongooseUserModel'
import { MongooseUsersRepository } from '../../../repositories/implementations/MongooseUsersRepository'

describe('Create User Use Case', () => {
  const mongod = new MongoMemoryServer()
  const usersRepository = new MongooseUsersRepository()

  beforeAll(async () => {
    const host = await mongod.getUri()
    const connection = new MongooseDatabaseConnection()
    await connection.connect({ host })
  })

  beforeEach(async () => {
    await MongooseUserModel.deleteMany({})
  })

  afterAll(async () => {
    await mongod.stop()
  })

  it('should create user with valid data', async () => {
    const name = 'Fulano da Silva'
    const email = 'fulano@email.com'
    const login = 'fulano'
    const password = 'beltrano'
    await createUserUseCase.execute({ name, email, login, password })
    const user = await usersRepository.findByLogin(login)
    expect(user).not.toBeNull()
  })

  it('should not create user with missing required data', async () => {
    const created = await createUserUseCase.execute({ name: '', email: '', login: 'fulano', password: '' })
    expect(created).toBe(false)

    const user = await usersRepository.findByLogin('fulano')
    expect(user).toBeNull()
  })
})
