import Boom from '@hapi/boom'
import { Request } from '@hapi/hapi'
import { User } from '../../entities/User'

import { AuthenticationUseCase } from './AuthenticationUseCase'

export class AuthenticationController {
  constructor (
    private authenticationUseCase: AuthenticationUseCase
  ) {
    this.authenticationUseCase = authenticationUseCase
    this.handle = this.handle.bind(this)
  }

  async handle (request: Request): Promise<{ user: User, token: string }|Boom.Boom> {
    const { login, password } = request.payload as { login: string, password: string }

    const { user, token } = await this.authenticationUseCase.execute({ login, password })

    if (!user) {
      return Boom.badImplementation('Invalid credentials')
    }

    return { user, token }
  }
}
