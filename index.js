const hapi = require('hapi')
const monggose = require('mongoose')
require('dotenv').config()

const server = hapi.server({
  port: 4000,
  host: 'localhost'
})

monggose.connect(`mongodb://${process.env.HAPI_USER}:${process.env.HAPI_PASSWORD}@${process.env.HAPI_SERVER}:${process.env.HAPI_PORT}/${process.env.HAPI_DB}`, { useNewUrlParser: true })

monggose.connection.once('open', () => {
  console.log('Database Connected')
})

const init = async () => {
  server.route({
    method: 'GET',
    path: '/',
    handler: (req, res) => {
      return `<h1>Todo Api with hapi.js</h1>`
    }
  })

  await server.start()
  console.log(`Server running at: ${server.info.uri}`)
}

init()
