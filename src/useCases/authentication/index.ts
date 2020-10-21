import MongooseAuthProvider from '../../providers/auth/implementations/MongooseAuthProvider'
import { AuthenticationController } from './AuthenticationController'

import { AuthenticationUseCase } from './AuthenticationUseCase'

const mongooseAuthProvider = new MongooseAuthProvider()

const authenticationUseCase = new AuthenticationUseCase(
  mongooseAuthProvider
)

const authenticationController = new AuthenticationController(
  authenticationUseCase
)

export { authenticationUseCase, authenticationController }
