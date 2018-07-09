const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TodoSchema = new Schema({
  title: String,
  description: String,
  isCompleted: Boolean
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  })

module.exports = mongoose.model('Todo', TodoSchema)
