import { MongoMemoryServer } from 'mongodb-memory-server'

import { User } from '../../entities/User'
import { MongooseDatabaseConnection } from '../../providers/database/implementations/MongooseDatabaseConnection'
import { MongooseUserModel } from './MongooseUserModel'
import { MongooseUsersRepository } from './MongooseUsersRepository'

const mongodb = new MongoMemoryServer()
const mongodbConnection = new MongooseDatabaseConnection()
const mongooseUsersRepository = new MongooseUsersRepository()
describe('Mongoose Users Repository Test Suite', () => {
  beforeAll(async () => {
    const host = await mongodb.getUri()
    await mongodbConnection.connect({ host })
  })
  afterEach(async () => {
    await MongooseUserModel.deleteMany({})
  })
  afterAll(async () => {
    await mongodbConnection.disconnect()
    await mongodb.stop()
  })

  it('should list all users', async () => {
    await MongooseUserModel.create([
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
    ])

    const { users } = await mongooseUsersRepository.findAll({})
    expect(users).toHaveLength(2)
  })

  it('should find a user by login', async () => {
    const user = new User({
      name: 'Fulano',
      email: 'fulano@email.com',
      login: 'fulano',
      password: 'beltrano'
    })
    const mongooseUser = new MongooseUserModel()
    Object.assign(mongooseUser, user)
    await mongooseUser.save()

    const foundUser = await mongooseUsersRepository.findByLogin('fulano')
    expect(foundUser).not.toBeNull()
  })

  it('should save a user', async () => {
    const user = new User({
      name: 'Fulano',
      email: 'fulano@email.com',
      login: 'fulano',
      password: 'beltrano'
    })
    const saved = await mongooseUsersRepository.save(user)
    expect(saved).toBe(true)
  })

  it('should not save a user with invalid data', async () => {
    const user = new User({
      name: '',
      email: '',
      login: '',
      password: ''
    })
    const saved = await mongooseUsersRepository.save(user)
    expect(saved).toBe(false)
  })

  it('should delete a user', async () => {
    await MongooseUserModel.create({
      name: 'Fulano',
      email: 'fulano@email.com',
      login: 'fulano',
      password: 'beltrano'
    })

    const foundUser = await mongooseUsersRepository.findByLogin('fulano')
    await mongooseUsersRepository.delete(foundUser)

    const notFoundUser = await mongooseUsersRepository.findByLogin('fulano')
    expect(notFoundUser).toBeNull()
  })

  it('should delete all users', async () => {
    await MongooseUserModel.create([
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
    ])

    const numberOfUserBeforeDelete = await MongooseUserModel.countDocuments()
    expect(numberOfUserBeforeDelete).toBe(2)

    await mongooseUsersRepository.deleteAll()
    const numberOfUserAfterDelete = await MongooseUserModel.countDocuments()
    expect(numberOfUserAfterDelete).toBe(0)
  })
})
