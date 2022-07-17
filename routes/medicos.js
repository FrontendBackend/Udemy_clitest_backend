/**
 * ruta: '/api/medicos'
 */

 const {Router} = require('express');
 const { check } = require('express-validator');
const { getMedicos, eliminarMedico, actualizarMedico, crearMedico } = require('../controllers/medicos');
 const { validarCampos } = require('../middlewares/validar-campos');
 const { validarJWT } = require('../middlewares/validar-jwt');
 
 const router = Router();
 
 router.get('/', validarJWT, getMedicos);
 
 router.post('/', 
 [
     validarJWT,
     check('nombre', 'El nombre del médico es necesario').not().isEmpty(),
     check('hospital', 'El hospital id debe de ser válido').isMongoId(),
     validarCampos
 ],
 crearMedico);
 
 router.put('/:id', 
 [
    validarJWT,
    check('nombre', 'El nombre del médico es necesario').not().isEmpty(),
    check('hospital', 'El hospital id debe de ser válido').isMongoId(),
    validarCampos
 ], 
 actualizarMedico);
 
 router.delete('/:id', validarJWT, eliminarMedico);
 
 module.exports = router;