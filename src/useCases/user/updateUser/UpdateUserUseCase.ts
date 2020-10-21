import { IUsersRepository } from '../../../repositories/IUsersRepository'
import { IUpdateUserDTO } from './IUpdateUserDTO'

export class UpdateUserUseCase {
  constructor (
    private usersRepository: IUsersRepository
  ) {
    this.usersRepository = usersRepository
  }

  async execute (login: string, data: IUpdateUserDTO): Promise<boolean> {
    const user = await this.usersRepository.findByLogin(login)

    if (!user) { return false }

    Object.assign(user, data)

    return await this.usersRepository.save(user)
  }
}
