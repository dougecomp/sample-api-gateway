import { User } from '../../../entities/User'
import { IUsersRepository } from '../../../repositories/IUsersRepository'

export class ListUserUseCase {
  constructor (
    private usersRepository: IUsersRepository
  ) {
    this.usersRepository = usersRepository
  }

  async execute (): Promise<{users: User[], totalItems: number, totalPages: number, page: number, limit: number}> {
    return await this.usersRepository.findAll({})
  }
}
