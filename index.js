const hapi = require('hapi')
const monggose = require('mongoose')
require('dotenv').config()
const Todo = require('./models/Todo')
const { graphqlHapi, graphiqlHapi } = require('apollo-server-hapi')
const schema = require('./graphql/schema')
const Inert = require('inert')
const Vision = require('vision')
const HapiSwagger = require('hapi-swagger')
const Pack = require('./package')
const Joi = require('joi')

const server = hapi.server({
  port: 4000,
  host: 'localhost'
})

monggose.connect(`mongodb://${process.env.HAPI_USER}:${process.env.HAPI_PASSWORD}@${process.env.HAPI_SERVER}:${process.env.HAPI_PORT}/${process.env.HAPI_DB}`, { useNewUrlParser: true })

monggose.connection.once('open', () => {
  console.log('Database Connected')
})

const init = async () => {

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: {
        info: {
          title: 'Todo API documentation',
          version: Pack.version
        }
      }
    }
  ])

  await server.register({
    plugin: graphiqlHapi,
    options: {
      path: '/graphiql',
      graphiqlOptions: {
        endpointURL: '/graphql'
      },
      route: {
        cors: true
      }
    }
  })

  await server.register({
    plugin: graphqlHapi,
    options: {
      path: '/graphql',
      graphqlOptions: {
        schema
      },
      route: {
        cors: true
      }
    }
  })

  server.route([{
    method: 'GET',
    path: '/',
    handler: (req, res) => {
      return `<h1>Todo Api with hapi.js</h1>`
    }
  }, {
    method: 'GET',
    path: '/api/v1/todos',
    config: {
      description: 'Get all the todos',
      tags: ['api', 'v1', 'todos', 'get'],
      handler: (req, res) => {
        return Todo.find()
      }
    }
  }, {
    method: 'GET',
    path: '/api/v1/todos/{id}',
    config: {
      description: 'Get a specific todo by ID',
      tags: ['api', 'v1', 'todo', 'get'],
      validate: {
        params: {
          id: Joi.string().required()
        }
      },
      handler: (req, res) => {
        const id = req.params.id
        return Todo.findById(id)
      }
    }
  }, {
    method: 'POST',
    path: '/api/v1/todos',
    config: {
      description: 'Post a todo',
      tags: ['api', 'v1', 'todo', 'post'],
      plugins: {
        'hapi-swagger': {
          payloadType: 'form'
        }
      },
      validate: {
        payload: Joi.object({
          title: Joi.string().required(),
          description: Joi.string().required(),
          isCompleted: Joi.boolean().required()
        })
      },
      handler: (req, res) => {
        const { title, description, isCompleted } = req.payload
        const todo = new Todo({
          title, description, isCompleted
        })

        return todo.save()
      }
    }
  }])

  await server.start()
  console.log(`Server running at: ${server.info.uri}`)
}

process.on('unhandledRejection', (err) => {
  if (err) {
    console.log(err)
    process.exit(1)
  }
})

init()
