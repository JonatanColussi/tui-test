import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'
import env from './config/env'
import cluster from 'cluster'
import os from 'os'

const numCPUs = os.cpus().length

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    const app = (await import('./config/app')).default

    if (cluster.isMaster && env.nodeEnv !== 'Development') {
      for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
      }

      console.log('Worker master started with success')

      cluster.on('exit', (worker) => {
        console.log(`worker ${worker.process.pid} died`)
      })
    } else {
      app.listen(env.port, () =>
        console.log(`Server started with success on port ${env.port}`)
      )
    }
  })
  .catch(console.error)
