import { MongoMemoryServer } from 'mongodb-memory-server'

import { MongooseDatabaseConnection } from '../../providers/database/implementations/MongooseDatabaseConnection'
import { MongooseUserModel } from './MongooseUserModel'

const mongodb = new MongoMemoryServer()
describe('Mongoose user model Test Suite', () => {
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
  it('should create user with valid data', async () => {
    await MongooseUserModel.create([
      {
        name: 'Fulano',
        email: 'fulano@email.com',
        login: 'fulano',
        password: 'beltrano'
      }
    ])
    const foundUser = await MongooseUserModel.findOne({ login: 'fulano' })
    expect(foundUser).not.toBeNull()
  })
  it('should not create user with invalid data', async () => {
    let validationError: string
    try {
      await MongooseUserModel.create([
        {
          name: '',
          email: 'fulano@email.com',
          login: '',
          password: 'beltrano'
        }
      ])
    } catch (error) {
      validationError = error
    }

    expect(validationError).toBeDefined()

    const foundUser = await MongooseUserModel.findOne({ login: 'fulano' })
    expect(foundUser).toBeNull()
  })

  it('should not update password when is up-to-date', async () => {
    await MongooseUserModel.create([
      {
        name: 'Fulano',
        email: 'fulano@email.com',
        login: 'fulano',
        password: 'beltrano'
      }
    ])
    const foundUser = await MongooseUserModel.findOne({ login: 'fulano' })

    const previousPassword = foundUser.password
    await foundUser.save()
    const currentPassword = foundUser.password

    expect(previousPassword).toEqual(currentPassword)
  })

  it('should update password when is changed', async () => {
    await MongooseUserModel.create([
      {
        name: 'Fulano',
        email: 'fulano@email.com',
        login: 'fulano',
        password: 'beltrano'
      }
    ])
    const foundUser = await MongooseUserModel.findOne({ login: 'fulano' })

    const previousPassword = foundUser.password
    const newPassword = 'mynewupdatedpassword'

    foundUser.password = newPassword
    await foundUser.save()
    const currentPassword = foundUser.password

    expect(previousPassword).not.toEqual(currentPassword)
  })
})
