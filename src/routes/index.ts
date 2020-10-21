import Hapi from '@hapi/hapi'

import { BaseRoute } from './BaseRoute'
import { AuthRoutes } from './AuthRoutes'
import { UserRoutes } from './UserRoutes'

function mapRoutes (Route: BaseRoute, methods: string[]): Hapi.ServerRoute[] {
  return methods.map(method => Route[method]())
}

const routes = [
  ...mapRoutes(new AuthRoutes(), AuthRoutes.methods()),
  ...mapRoutes(new UserRoutes(), UserRoutes.methods())
]

export { routes }
