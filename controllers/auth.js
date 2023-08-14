const Usuario = require("../models/usuario")
const bcrypt = require("bcryptjs")
const { generarJWT } = require("../helpers/jwt")
const { googleVerify } = require("../helpers/google-verify")

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

const googleSignIn = async (req, res) => {
  try {
    const { email, name, picture } = await googleVerify(
      req.body.token
    )

    const usuarioDB = await Usuario.findOne({ email })
    let usuario

    if (!usuarioDB) {
      usuario = new Usuario({
        nombre: name,
        email: email,
        password: "@@",
        img: picture,
        google: true,
      })
    } else {
      usuario = usuarioDB
      usuario.google = true
    }

    // Guardar Usuario
    await usuario.save()

    //Generar el token

    const token = await generarJWT(usuario.id)

    res.json({
      ok: true,
      email,
      name,
      picture,
      token,
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      ok: false,
      msg: "Token de google no es correcto",
    })
  }
}

const renewToken = async(req, res)=>{
  
const id = req.id

  //Generar el token
  const token = await generarJWT(id)

  // Obtener el usuario por ID

  const usuarioDB = await Usuario.findById(id)



  res.json({
    ok: true,
    token,
    usuarioDB
  })
}

module.exports = {
  login,
  googleSignIn,
  renewToken
}
