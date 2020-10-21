import Hapi from '@hapi/hapi'
import hapiJwt from '@hapi/jwt'
import Inert from '@hapi/inert'
import Vision from '@hapi/vision'
import HapiSwagger from 'hapi-swagger'

import { routes } from './routes'

const app = Hapi.server({
  port: process.env.PORT || 3000,
  routes: {
    cors: true,
    validate: {
      failAction: function (request, h, err) {
        throw err
      },
      options: {
        abortEarly: false
      }
    }
  }
})

const swaggerConfig: HapiSwagger.RegisterOptions = {
  info: {
    title: 'UEFS API Gateway',
    version: 'v1.0'
  }
}

async function makeApp (): Promise<Hapi.Server> {
  await app.register([
    {
      plugin: hapiJwt
    },
    {
      plugin: Inert
    },
    {
      plugin: Vision
    },
    {
      plugin: HapiSwagger,
      options: swaggerConfig
    }
  ])

  app.route(routes)

  app.auth.strategy('jwt', 'jwt', {
    keys: process.env.JWT_SECRET,
    verify: false,
    validate: () => {
      return {
        isValid: true
      }
    }
  })
  app.auth.default('jwt')

  return app
}

process.on('unhandledRejection', (err) => {
  console.error(err)
  process.exit(1)
})

export { makeApp }
