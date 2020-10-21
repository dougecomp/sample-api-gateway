import { MongoMemoryServer } from 'mongodb-memory-server'
import { User } from '../../../entities/User'

import { MongooseDatabaseConnection } from '../../../providers/database/implementations/MongooseDatabaseConnection'
import { MongooseUserModel } from '../../../repositories/implementations/MongooseUserModel'
import { MongooseUsersRepository } from '../../../repositories/implementations/MongooseUsersRepository'
import { deleteUserUseCase } from '.'

describe('Delete User Use Case Test Suite', () => {
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

  it('should delete a user', async () => {
    const user = new User({
      name: 'Fulano da Silva',
      email: 'fulano@email.com',
      login: 'fulano',
      password: 'beltrano'
    })
    await usersRepository.save(user)

    const login = 'fulano'

    const foundUser = await usersRepository.findByLogin(login)
    expect(foundUser).not.toBeNull()

    const deleted = await deleteUserUseCase.execute(login)
    const notFoundUser = await usersRepository.findByLogin(login)

    expect(deleted).toBe(true)
    expect(notFoundUser).toBeNull()
  })
})
