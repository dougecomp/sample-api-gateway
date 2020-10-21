import { MongoMemoryServer } from 'mongodb-memory-server'
import { updateUserUseCase } from '.'

import { MongooseDatabaseConnection } from '../../../providers/database/implementations/MongooseDatabaseConnection'
import { MongooseUserModel } from '../../../repositories/implementations/MongooseUserModel'
import { MongooseUsersRepository } from '../../../repositories/implementations/MongooseUsersRepository'

describe('Update User Use Case Test Suite', () => {
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

  it('should update user with valid data', async () => {
    const name = 'Fulano da Silva'
    const email = 'fulano@email.com'
    const login = 'fulano'
    const password = 'beltrano'
    await MongooseUserModel.create([
      {
        name,
        email,
        login,
        password
      }
    ])

    const saved = await updateUserUseCase.execute(login, { name: 'Fulannnuuuu', email: 'fulannnuuuu@email.com', password: 'fulano' })
    const updatedUser = await usersRepository.findByLogin(login)
    expect(saved).toBe(true)
    expect(updatedUser.email).toBe('fulannnuuuu@email.com')
    expect(updatedUser.name).toBe('Fulannnuuuu')
  })

  it('should not update user with missing required data', async () => {
    const name = 'Fulano da Silva'
    const email = 'fulano@email.com'
    const login = 'fulano'
    const password = 'beltrano'
    await MongooseUserModel.create([
      {
        name,
        email,
        login,
        password
      }
    ])

    const saved = await updateUserUseCase.execute(login, { name: '' })
    expect(saved).toBe(false)
  })
})
