const { Router } = require("express")

const { check } = require("express-validator") // npm i express-validator ver documentación

const { validarCampos } = require("../middlewares/validar-campos")

const { validarJWT } = require("../middlewares/validar-jwt")

const {
  getMedicos,
  crearMedico,
  actualizarMedico,
  borrarMedico,
} = require("../controllers/medicos")

const router = Router()

router.get("/", getMedicos)

router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("hospital", "El hospital id debe ser valido").isMongoId(),
    validarCampos,
  ],
  crearMedico
)

router.put("/:id", [], actualizarMedico)

router.delete("/:id", borrarMedico)

module.exports = router
