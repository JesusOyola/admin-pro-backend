const Medico = require("../models/medico")

const getMedicos = async (req, res) => {
  const medicos = await Medico.find()
    .populate("usuario", "nombre img")
    .populate("hospital", "nombre img")
  res.json({
    ok: true,
    medicos,
  })
}

const crearMedico = async (req, res) => {
  const id = req.id
  const medico = new Medico({
    usuario: id,
    ...req.body,
  })

  try {
    const medicoDB = await medico.save()

    res.json({
      ok: true,
      medicoDB,
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Ocurrió un error,hable con el administrador",
    })
  }
}

const actualizarMedico = (req, res) => {
  res.json({
    ok: true,
    msg: "Actualizar medico",
  })
}

const borrarMedico = (req, res) => {
  res.json({
    ok: true,
    msg: "Borrar medico",
  })
}

module.exports = {
  getMedicos,
  crearMedico,
  actualizarMedico,
  borrarMedico,
}
