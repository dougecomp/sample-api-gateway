import Hapi from '@hapi/hapi'
import Joi from 'joi'

import { BaseRoute } from './BaseRoute'
import { authenticationController } from '../useCases/authentication'

export class AuthRoutes extends BaseRoute {
  login (): Hapi.ServerRoute {
    return {
      path: '/login',
      method: 'POST',
      options: {
        tags: ['api'],
        description: 'login users',
        notes: 'Login a user',
        validate: {
          payload: Joi.object({
            login: Joi.string().required(),
            password: Joi.string().required()
          })
        },
        auth: false
      },
      handler: authenticationController.handle
    }
  }
}
