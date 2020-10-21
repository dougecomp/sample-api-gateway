import mongoose from 'mongoose'

import { IDatabaseConnection, IDatabaseConnectionConfig } from '../IDatabaseConnection'

export class MongooseDatabaseConnection implements IDatabaseConnection {
  async connect (config?: IDatabaseConnectionConfig): Promise<boolean> {
    try {
      await mongoose.connect(config ? config.host : process.env.MONGO_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
      })
      return true
    } catch (error) {
      return false
    }
  }

  async disconnect (): Promise<void> {
    await mongoose.disconnect()
  }
}
