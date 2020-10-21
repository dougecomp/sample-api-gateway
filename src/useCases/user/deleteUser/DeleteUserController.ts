import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi'

import { DeleteUserUseCase } from './DeleteUserUseCase'

export class DeleteUserController {
  constructor (
    private deleteUserUseCase: DeleteUserUseCase
  ) {
    this.deleteUserUseCase = deleteUserUseCase
    this.handle = this.handle.bind(this)
  }

  async handle (request: Request, response: ResponseToolkit): Promise<ResponseObject> {
    const { login } = request.params

    const deleted = await this.deleteUserUseCase.execute(login)

    return response.response({ deleted })
  }
}
