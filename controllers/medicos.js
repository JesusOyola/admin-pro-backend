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

const actualizarMedico = async (req, res) => {
  const id = req.params.id
  const idUsuario = req.id

  try {
    const medicoDB = await Medico.findById(id)

    if (!medicoDB) {
      res.status(404).json({
        ok: false,
        msg: "No se encontró un medico con ese id",
      })
    }
    const cambiosMedico = {
      ...req.body,
      usuario: idUsuario,
    }

    const medicoActualizado = await Medico.findByIdAndUpdate(
      id,
      cambiosMedico,
      { new: true }
    )

    res.json({
      ok: true,
      medico: medicoActualizado,
      msg: "Medico actualizado",
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      ok: false,
      msg: "Ocurrió un error,hable con el administrador",
    })
  }
}

const borrarMedico = async (req, res) => {
  const id = req.params.id

  try {
    const medicoDB = await Medico.findById(id)

    if (!medicoDB) {
      res.status(404).json({
        ok: false,
        msg: "No se encontró un medico con ese id",
      })
    }

    const medicoEliminado = await Medico.findByIdAndDelete(id)

    res.json({
      ok: true,
      msg: "Medico eliminado",
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      ok: false,
      msg: "Ocurrió un error,hable con el administrador",
    })
  }
}

module.exports = {
  getMedicos,
  crearMedico,
  actualizarMedico,
  borrarMedico,
}
