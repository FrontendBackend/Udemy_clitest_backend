const  {response} = require('express');
const Medico = require('../models/medico')

/**
 * Me permite listar los usuarios
 * @param {*} req 
 * @param {*} res 
 */
const getMedicos = async(req, res = response) => {

    const medico = await Medico.find()
    .populate('usuario', 'nombre img')
    .populate('hospital', 'nombre img')

    res.json({
        ok: true,
        medico,
        // uid: req.uid,
    })
};

const crearMedico = async(req, res = response) => {

    const uid = req.uid
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });

   try {

        // Guardar hospital
        const medicoDB = await medico.save();

        res.json({
            ok: true,
            medico: medicoDB,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    };
};

const actualizarMedico = (req, res = response) => {

    res.json({
        ok: true,
        msg: 'actualizarMedico',
        // uid: req.uid,
    })
};

const eliminarMedico = (req, res = response) => {

    res.json({
        ok: true,
        msg: 'eliminarMedico',
        // uid: req.uid,
    })
};

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    eliminarMedico
}