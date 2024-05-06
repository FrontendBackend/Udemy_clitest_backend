const bcrypt = require('bcryptjs');
const  {response} = require('express');
const { googleVerfy } = require('../helpers/google-verify');
const { generarJWT } = require('../helpers/jwt');
const Usuario = require("../models/usuario");

const login = async (req, res = response) => {

    const {email, password} = req.body;

    try {

        //Verificar email
        const usuarioDB = await Usuario.findOne({
            email
        });

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        };

        //Verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no válida'
            });
        };

        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}

const googleSignIn = async (req, res = response) => {

    try {
        const {email, name, picture} = await googleVerfy(req.body.token);

        let usuario;

        const usuarioDB = await Usuario.findOne({email});

        if(!usuarioDB){
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            })
        }else {
            usuario = usuarioDB;
            usuario.google = true;
        }

        // Guardar Usuario
        await usuario.save();

        // Generar el TOKEN - JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            email, name, picture,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Token de Google no es correcto'
        });
    }
}

const renewToken = async (req, res = response) => {

    const uid = req.uid;

    // Generar el token JWT
    const token = await generarJWT(uid);
    
    // Obtener el usuario por ID
    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        token,
        usuario
    });
}

module.exports = {
    login,
    googleSignIn,
    renewToken
}