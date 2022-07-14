/**
 * ruta: api/todo/busquedas
 */

const {Router} = require('express');
const { getTodo, getBusquedaColeccion } = require('../controllers/busquedas');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/:busqueda', validarJWT, getTodo);

router.get('/coleccion/:tabla/:busqueda', validarJWT, getBusquedaColeccion);


module.exports = router;