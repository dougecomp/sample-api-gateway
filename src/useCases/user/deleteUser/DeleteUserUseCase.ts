import { IUsersRepository } from '../../../repositories/IUsersRepository'

export class DeleteUserUseCase {
  constructor (
    private usersRepository: IUsersRepository
  ) {
    this.usersRepository = usersRepository
  }

  async execute (login: string): Promise<boolean> {
    const user = await this.usersRepository.findByLogin(login)

    if (!user) { return false }

    return await this.usersRepository.delete(user)
  }
}
