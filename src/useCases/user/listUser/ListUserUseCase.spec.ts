import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongooseDatabaseConnection } from '../../../providers/database/implementations/MongooseDatabaseConnection'
import { MongooseUserModel } from '../../../repositories/implementations/MongooseUserModel'
import { MongooseUsersRepository } from '../../../repositories/implementations/MongooseUsersRepository'

describe('List User Use Case Test Suite', () => {
  const mongod = new MongoMemoryServer()
  const usersRepository = new MongooseUsersRepository()

  beforeAll(async () => {
    const host = await mongod.getUri()
    const connection = new MongooseDatabaseConnection()
    await connection.connect({ host })
  })

  afterEach(async () => {
    await MongooseUserModel.deleteMany({})
  })

  afterAll(async () => {
    await mongod.stop()
  })

  it('should list all users on database', async () => {
    const { users: noUsersWithEmptyDatabase } = await usersRepository.findAll({})
    expect(noUsersWithEmptyDatabase).toHaveLength(0)

    const usersToInsert = [
      {
        name: 'Fulano',
        email: 'fulano@email.com',
        login: 'fulano',
        password: 'beltrano'
      },
      {
        name: 'Beltrano',
        email: 'beltrano@email.com',
        login: 'beltrano',
        password: 'cicrano'
      }
    ]
    await MongooseUserModel.create(usersToInsert)

    const { users: allUsersOnDatabase } = await usersRepository.findAll({})
    expect(allUsersOnDatabase).toHaveLength(usersToInsert.length)
  })
})
