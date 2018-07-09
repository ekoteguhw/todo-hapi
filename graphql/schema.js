const graphql = require('graphql')
const TodoType = require('./TodoType')
const Todo = require('../models/Todo')

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema
} = graphql

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    todo: {
      type: TodoType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return Todo.findById(args.id)
      }
    }
  }
})

module.exports = new GraphQLSchema({ query: RootQuery })
