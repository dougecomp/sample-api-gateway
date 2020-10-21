import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi'
import Boom from '@hapi/boom'
import { CreateUserUseCase } from './CreateUserUseCase'

export class CreateUserController {
  constructor (
    private createUserUseCase: CreateUserUseCase
  ) {
    this.createUserUseCase = createUserUseCase
    this.handle = this.handle.bind(this)
  }

  async handle (request: Request, response: ResponseToolkit): Promise<ResponseObject|Boom.Boom> {
    const { name, email, login, password } = request.payload as {name: string, email: string, login: string, password: string}

    const created = await this.createUserUseCase.execute({ name, email, login, password })
    if (!created) {
      return Boom.badImplementation('Unexpected error ocurred')
    }

    return response.response({}).code(201)
  }
}
