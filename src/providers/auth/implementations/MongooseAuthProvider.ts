import { IAuthProvider, IAuthenticationCredentialsDTO } from '../AuthProvider'
import { User } from '../../../entities/User'
import { MongooseUsersRepository } from '../../../repositories/implementations/MongooseUsersRepository'

export default class MongooseAuthProvider implements IAuthProvider {
  async authenticate (credentials: IAuthenticationCredentialsDTO): Promise<User> {
    const { login, password } = credentials

    const usersRepository = new MongooseUsersRepository()
    const user = await usersRepository.findByLogin(login)

    if (!user) { return null }

    const isAuthenticated = await user.comparePassword(password)

    if (!isAuthenticated) { return null }

    delete user.password
    return user
  }
}
