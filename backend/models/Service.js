const mongoose = require('../db/conn')
const { Schema } = mongoose

const Service = mongoose.model(
  'Service',
  new Schema({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
    available: {
      type: Boolean,
    },
    user: Object,    // contratante
    worker: Object,  // trabalhador que for contratado
  }, { timestamps: true }),
)

module.exports = Service
