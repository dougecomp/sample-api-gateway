import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi'
import Boom from '@hapi/boom'

import { UpdateUserUseCase } from './UpdateUserUseCase'

export class UpdateUserController {
  constructor (
    private updateUserUseCase: UpdateUserUseCase
  ) {
    this.updateUserUseCase = updateUserUseCase
    this.handle = this.handle.bind(this)
  }

  async handle (request: Request, response: ResponseToolkit): Promise<ResponseObject|Boom.Boom> {
    const { name, email, password } = request.payload as {name: string, email: string, password: string}
    const { login } = request.params

    const saved = await this.updateUserUseCase.execute(login as string, { name, email, password })

    if (!saved) {
      return Boom.badImplementation(`Could not update user with login ${login}`, { saved })
    }

    return response.response({ saved })
  }
}
