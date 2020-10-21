import Hapi from '@hapi/hapi'
import Joi from 'joi'

import { BaseRoute } from './BaseRoute'

import { listUserController } from '../useCases/user/listUser'
import { createUserController } from '../useCases/user/createUser'
import { updateUserController } from '../useCases/user/updateUser'
import { deleteUserController } from '../useCases/user/deleteUser'

export class UserRoutes extends BaseRoute {
  list (): Hapi.ServerRoute {
    return {
      path: '/users',
      method: 'GET',
      options: {
        tags: ['api'],
        description: 'List users',
        notes: 'List paginated users',
        validate: {
          headers: Joi.object({
            authorization: Joi.string().required()
          }),
          options: {
            allowUnknown: true
          }
        }
      },
      handler: listUserController.handle
    }
  }

  create (): Hapi.ServerRoute {
    return {
      method: 'POST',
      path: '/users',
      options: {
        tags: ['api'],
        description: 'Create users',
        notes: 'Create a user',
        validate: {
          payload: Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            login: Joi.string().required(),
            password: Joi.string().required()
          }),
          headers: Joi.object({
            authorization: Joi.string().required()
          }),
          options: {
            allowUnknown: true
          }
        }
      },
      handler: createUserController.handle
    }
  }

  update (): Hapi.ServerRoute {
    return {
      method: 'PUT',
      path: '/users/{login}',
      options: {
        tags: ['api'],
        description: 'Update users',
        notes: 'Update a user',
        validate: {
          payload: Joi.object({
            name: Joi.string().empty(),
            email: Joi.string().email().empty(),
            password: Joi.string().empty()
          }),
          params: Joi.object({
            login: Joi.string().required()
          }),
          headers: Joi.object({
            authorization: Joi.string().required()
          }),
          options: {
            allowUnknown: true
          }
        }
      },
      handler: updateUserController.handle
    }
  }

  delete (): Hapi.ServerRoute {
    return {
      method: 'DELETE',
      path: '/users/{login}',
      options: {
        tags: ['api'],
        description: 'Delete users',
        notes: 'Delete a user',
        validate: {
          params: Joi.object({
            login: Joi.string().required()
          }),
          headers: Joi.object({
            authorization: Joi.string().required()
          }),
          options: {
            allowUnknown: true
          }
        }
      },
      handler: deleteUserController.handle
    }
  }
}
