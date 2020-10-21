import { User } from '../../../entities/User'
import { IUsersRepository } from '../../../repositories/IUsersRepository'
import { ICreateUserDTO } from './ICreateUserDTO'

export class CreateUserUseCase {
  constructor (
    private usersRepository: IUsersRepository
  ) {
    this.usersRepository = usersRepository
  }

  async execute (data: ICreateUserDTO): Promise<boolean> {
    const user = new User(data)

    return await this.usersRepository.save(user)
  }
}
