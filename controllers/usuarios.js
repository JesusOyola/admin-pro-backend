const Usuario = require("../models/usuario")
const bcrypt = require("bcryptjs")
const { generarJWT } = require("../helpers/jwt")

const getUsuarios = async (req, res) => {
  const usuarios = await Usuario.find()
  res.json({
    ok: true,
    usuarios,
  })
}

const crearUsuarios = async (req, res) => {
  const { email, password, nombre } = req.body

  try {
    const existeEmail = await Usuario.findOne({ email })

    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: `El usuario ${email} ya está registrado`,
      })
    }

    const usuario = new Usuario(req.body)

    //Encriptar contraseña

    const salt = bcrypt.genSaltSync()

    usuario.password = bcrypt.hashSync(password, salt)

    //Guardar usuario
    await usuario.save()

     //Generar el token

     const token = await generarJWT(usuario.id)


    res.json({
      ok: true,
      usuario,
      token
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    })
  }
}

const actualizarUsuario = async (req, res) => {
  //TODO: Validar token y comprobar si es el usuario correcto

  const id = req.params.id

  try {
    const usuarioDB = await Usuario.findById(id)

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: `No existe un usuario con este ${id}`,
      })
    }
    //Actualizaciones

    const campos = req.body
    if (usuarioDB.email === req.body.email) {
      delete campos.email
    } else {
      const existeEmail = await Usuario.findOne({
        email: req.body.email,
      })
      if (existeEmail) {
        return res.status(400).json({
          ok: false,
          msg: `Ya existe un usuarion con el email ${req.body.email}`,
        })
      }
    }
    delete campos.password // para que no me actualice el password
    delete campos.google // para que no me actualice el google

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      id,
      campos,
      { new: true }
    )

    res.json({
      ok: true,
      usuarioActualizado,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    })
  }
}

const borrarUsuario = async (req, res) => {
  const id = req.params.id

  try {
    const usuarioDB = await Usuario.findById(id)
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: `No existe un usuario con el id ${id}`,
      })
    }

    await Usuario.findByIdAndDelete(id)
    res.status(200).json({
      ok: true,
      msg: `Usuario con id ${id} eliminado`,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: "Hubo un error inesperado",
    })
  }
}

module.exports = {
  getUsuarios,
  crearUsuarios,
  actualizarUsuario,
  borrarUsuario,
}
