
import { User } from '../../entities/User'
import { IUserQuery, IUsersRepository } from '../IUsersRepository'
import { IMongooseUserDocument, MongooseUserModel } from './MongooseUserModel'

export class MongooseUsersRepository implements IUsersRepository {
  async findAll (params: IUserQuery): Promise<{users: User[], totalItems: number, totalPages: number, page: number, limit: number}> {
    const { page = 1, limit = 10 } = params

    const modelsPaginated = await MongooseUserModel.paginate({ page, limit })
    const { totalDocs: totalItems, totalPages } = modelsPaginated

    const mongooseUsers: IMongooseUserDocument[] = modelsPaginated.docs
    const users = mongooseUsers.map((mongooseUser) => {
      const { id, name, email, login, password } = mongooseUser
      const user = new User({ name, email, login, password }, id)
      return user
    })

    return { users, totalItems, totalPages, page, limit }
  }

  async findByLogin (login: string): Promise<User> {
    const mongooseUser = await MongooseUserModel.findOne({ login })

    if (!mongooseUser) {
      return null
    }

    const { id, name, email, password } = mongooseUser
    return new User({ name, email, login, password }, id)
  }

  async save (user: User): Promise<boolean> {
    let mongooseUser = await MongooseUserModel.findOne({ login: user.login })

    if (!mongooseUser) {
      mongooseUser = new MongooseUserModel()
    }

    for (const key in user) {
      if (user[key] === undefined) delete (user[key])
    }
    Object.assign(mongooseUser, user)

    try {
      await mongooseUser.save()
      user.password = mongooseUser.password
      return true
    } catch (error) {
      return false
    }
  }

  async delete (user: User): Promise<boolean> {
    const mongooseUser = await MongooseUserModel.findOne({ login: user.login })

    if (!mongooseUser) {
      return false
    }

    await mongooseUser.remove()
    return true
  }

  async deleteAll (): Promise<void> {
    await MongooseUserModel.deleteMany({})
  }
}
