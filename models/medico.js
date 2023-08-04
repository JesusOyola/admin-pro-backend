const { Schema, model } = require("mongoose")

const MedicoSchema = Schema({
  nombre: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  },
  usuario:{
    type: Schema.Types.ObjectId,
    ref:'Usuario',
    required: true,
  },
  hospital:{
    type: Schema.Types.ObjectId,
    ref:'Hospital',
    required: true,
  }
})

module.exports = model("Medico", MedicoSchema)
