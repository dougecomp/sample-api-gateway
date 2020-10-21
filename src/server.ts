import Hapi from '@hapi/hapi'

import { makeApp } from './app'
import { MongooseDatabaseConnection } from './providers/database/implementations/MongooseDatabaseConnection'

async function makeServer ():Promise<Hapi.Server> {
  const app = await makeApp()

  const connection = new MongooseDatabaseConnection()
  const connected = await connection.connect()
  if (connected) {
    console.log('Successful connection to database')
  } else {
    console.error('Failed connection to database')
  }

  await app.start()
  console.log('Server running at', app.info.uri)

  return app
}

export { makeServer }
