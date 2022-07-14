/**
 * ruta: api/uploads
 */

 const {Router} = require('express');
const { subirArchivos, retornarImagen } = require('../controllers/uploads');
 const { validarJWT } = require('../middlewares/validar-jwt');
 const fileUpload = require('express-fileupload');
 
 
 const router = Router();

 router.use(fileUpload());
 
 router.put('/:tipo/:id', validarJWT, subirArchivos);
 router.get('/:tipo/:foto', retornarImagen);
 
 module.exports = router;