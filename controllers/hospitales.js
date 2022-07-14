const  {response} = require('express');
const Hospital = require('../models/hospital');

/**
 * Me permite listar los usuarios
 * @param {*} req 
 * @param {*} res 
 */
const getHospitales = async (req, res = response) => {

    const hospitales = await Hospital.find()
    .populate('usuario', 'nombre img')

    res.json({
        ok: true,
        hospitales,
        // uid: req.uid,
    })
};

const crearHospital = async(req, res = response) => {
    const uid = req.uid
    const hospital = new Hospital({
        usuario: uid,
        ...req.body
    });

   try {

        // Guardar hospital
        const hospitalDB = await hospital.save();

        res.json({
            ok: true,
            hospital: hospitalDB,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    };
};

const actualizarHospital = (req, res = response) => {

    res.json({
        ok: true,
        msg: 'actualizarHospital',
        // uid: req.uid,
    })
};

const eliminarHospital = (req, res = response) => {

    res.json({
        ok: true,
        msg: 'eliminarHospital',
        // uid: req.uid,
    })
};

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    eliminarHospital
}