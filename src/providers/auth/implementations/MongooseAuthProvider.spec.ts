import { MongoMemoryServer } from 'mongodb-memory-server'

import { User } from '../../../entities/User'
import { MongooseUserModel } from '../../../repositories/implementations/MongooseUserModel'
import { MongooseUsersRepository } from '../../../repositories/implementations/MongooseUsersRepository'
import { MongooseDatabaseConnection } from '../../database/implementations/MongooseDatabaseConnection'
import MongooseAuthProvider from './MongooseAuthProvider'

const mongodb = new MongoMemoryServer()
describe('Mongoose Authentication Provider Test Suite', () => {
  beforeAll(async () => {
    const host = await mongodb.getUri()
    const connection = new MongooseDatabaseConnection()
    connection.connect({ host })
  })
  afterEach(async () => {
    await MongooseUserModel.deleteMany({})
  })
  afterAll(async () => {
    await mongodb.stop()
  })

  it('should authenticate user on the mongodb database', async () => {
    const user = new User({
      name: 'Fulano',
      email: 'fulano@email.com',
      login: 'fulano',
      password: 'beltrano'
    })

    const mongooseUsersRepository = new MongooseUsersRepository()
    await mongooseUsersRepository.save(user)

    const mongooseAuthProvider = new MongooseAuthProvider()
    const authenticatedUser = await mongooseAuthProvider.authenticate({ login: 'fulano', password: 'beltrano' })

    expect(authenticatedUser).not.toBeNull()
  })

  it('should not authenticate invalid user on the mongoose database', async () => {
    const user = new User({
      name: 'Fulano',
      email: 'fulano@email.com',
      login: 'fulano',
      password: 'beltrano'
    })

    const mongooseUsersRepository = new MongooseUsersRepository()
    await mongooseUsersRepository.save(user)

    const mongooseAuthProvider = new MongooseAuthProvider()
    const authenticatedUser = await mongooseAuthProvider.authenticate({ login: 'fulanu', password: 'beltranu' })

    expect(authenticatedUser).toBeNull()
  })

  it('should not authenticate user not on the mongoose database', async () => {
    const mongooseAuthProvider = new MongooseAuthProvider()
    const authenticatedUser = await mongooseAuthProvider.authenticate({ login: 'fulanu', password: 'beltranu' })

    expect(authenticatedUser).toBeNull()
  })
})
