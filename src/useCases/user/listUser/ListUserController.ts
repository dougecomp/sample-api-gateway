import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi'

import { ListUserUseCase } from './ListUserUseCase'

export class ListUserController {
  constructor (
    private listUserUseCase: ListUserUseCase
  ) {
    this.listUserUseCase = listUserUseCase
    this.handle = this.handle.bind(this)
  }

  async handle (request: Request, response: ResponseToolkit): Promise<ResponseObject> {
    const { users, limit, page, totalItems, totalPages } = await this.listUserUseCase.execute()

    return response.response({ users, limit, page, totalItems, totalPages })
  }
}
