import jwt from 'jsonwebtoken'

import { User } from '../../entities/User'

import { IAuthProvider } from '../../providers/auth/AuthProvider'
import { IAuthenticationDTO } from './AuthenticationDTO'

export class AuthenticationUseCase {
  constructor (
    private authProvider: IAuthProvider
  ) {
    this.authProvider = authProvider
  }

  async execute (data: IAuthenticationDTO): Promise<{user: User, token: string}> {
    const user = await this.authProvider.authenticate(data)

    let token: string = null
    if (user) {
      token = jwt.sign({ user }, process.env.JWT_SECRET, {
        expiresIn: '1 day'
      })
    }
    console.log('Vai Travis')

    return { user, token }
  }
}
