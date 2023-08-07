const Hospital = require("../models/hospital")

const getHospitales = async (req, res) => {
  const hospitales = await Hospital.find().populate(
    "usuario",
    "nombre img"
  )
  res.json({
    ok: true,
    hospitales,
  })
}

const crearHospital = async (req, res) => {
  const id = req.id
  const pepe = req.body
  const hospital = new Hospital({ usuario: id, ...req.body }) //En el body no viene el id pero si se lo estoy mandando en el middleware del jwt

  console.log(id)

  try {
    const hospitalDB = await hospital.save()

    res.json({
      ok: true,
      hospitalDB,
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Ocurrió un error,hable con el administrador",
    })
  }
}

const actualizarHospital = async (req, res) => {
  const id = req.params.id
  const idUsuario = req.id
  try {
    const hospitalDB = await Hospital.findById(id)

    if (!hospitalDB) {
      res.status(404).json({
        ok: false,
        msg: "No se encontró un hospital con ese id",
      })
    }

    const cambiosHospital = {
      ...req.body,
      usuario: idUsuario,
    }

    const hospitalActualizado = await Hospital.findByIdAndUpdate(
      id,
      cambiosHospital,
      { new: true }
    )

    res.json({
      ok: true,
      hospital: hospitalActualizado,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: "Ocurrió un error,hable con el administrador",
    })
  }
}

const borrarHospital = async (req, res) => {
  const id = req.params.id

  try {
    const hospitalDB = await Hospital.findById(id)

    if (!hospitalDB) {
      res.status(404).json({
        ok: false,
        msg: "No se encontró un hospital con ese id",
      })
    }

    await Hospital.findByIdAndDelete(id)

    res.json({
      ok: true,
      msg: "Hospital eliminado",
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: "Ocurrió un error,hable con el administrador",
    })
  }
}

module.exports = {
  getHospitales,
  crearHospital,
  actualizarHospital,
  borrarHospital,
}
