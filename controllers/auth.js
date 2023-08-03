const Usuario = require("../models/usuario")
const bcrypt = require("bcryptjs")
const { generarJWT } = require("../helpers/jwt")

const login = async (req, res) => {
  const { email, password } = req.body

  try {
    // Verificar email
    const usuarioDB = await Usuario.findOne({ email })

    if (!usuarioDB) {
      res.status(404).json({
        ok: false,
        msg: `No existe un usuario con el mail ${email}`,
      })
    }

    // Verificar contraseña

    const validPassword = bcrypt.compareSync(
      password,
      usuarioDB.password
    )

    if (!validPassword) {
      res.status(404).json({
        ok: false,
        msg: "Contraseña no válida",
      })
    }

    //Generar el token

    const token = await generarJWT(usuarioDB.id)

    res.json({
      ok: true,
      token,
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    })
  }
}

module.exports = {
  login,
}
