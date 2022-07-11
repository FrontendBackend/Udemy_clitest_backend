const bcrypt = require('bcryptjs');
const  {response} = require('express');
const { generarJWT } = require('../helpers/jwt');
const Usuario = require("../models/usuario");

/**
 * Me permite listar los usuarios
 * @param {*} req 
 * @param {*} res 
 */
const getUsuarios = async(req, res) => {

    const usuarios = await Usuario.find({}, 'nombre email role google');

    res.json({
        ok: true,
        usuarios,
        // uid: req.uid,
    })
};

/**
 * Me permite crear nuevos usuarios
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const crearUsuarios = async(req, res = response) => {

    const {email, password} = req.body;
    
    try {
        // Validar el correo ya existente
        const existeEmail = await Usuario.findOne({
            email
        });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya existe'
            })
        };

        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        // Generar TOKEN
        const token = await generarJWT(usuario.id);

        // Guardar usuario
        await usuario.save();

        res.json({
            ok: true,
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    };
   
};

/**
 * Me permite actualizar los usuarios
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const actualizarUsuario = async (req, res = response) => {
    
    // TODO: Validar token y comprobar si es el usuario correcto
    const uid = req.params.id

    
    try {
        const usuarioDB = await Usuario.findById(uid)
        
        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        // Actualizaciones
        const {password, google, email, ...campos} = req.body;

        if(usuarioDB.email !== email){
         
            const existeEmail = await Usuario.findOne({email});
            if (existeEmail){
                return res.status(400).json({
                    ok: false,
                    msg: 'No existe un usuario con ese email'
                });
            };
        };

        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {new: true});

        res.json({
            ok: true,
            usuarioActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}

const borrarUsuario = async (req, res = response) => {

    const uid = req.params.id

    try {

        const usuarioDB = await Usuario.findById(uid)
        
        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        await Usuario.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}


module.exports = {
    getUsuarios,
    crearUsuarios,
    actualizarUsuario,
    borrarUsuario,
};