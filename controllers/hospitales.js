const Hospital = require("../models/hospital")

const getHospitales = async(req, res) => {

  const hospitales = await Hospital.find().populate('usuario','nombre img')
  res.json({
    ok: true,
    hospitales
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

const actualizarHospital = (req, res) => {
  res.json({
    ok: true,
    msg: "Actualizar hospital",
  })
}

const borrarHospital = (req, res) => {
  res.json({
    ok: true,
    msg: "Borrar hospital",
  })
}

module.exports = {
  getHospitales,
  crearHospital,
  actualizarHospital,
  borrarHospital,
}
