"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const env_1 = __importDefault(require("../enviroments/env"));
const mongo_helper_1 = __importDefault(require("../helpers/mongo.helper"));
const token_helper_1 = __importDefault(require("../helpers/token.helper"));
const mongodb_1 = __importDefault(require("mongodb"));
const Routes = express_1.Router();
const mongo = mongo_helper_1.default.getInstance(env_1.default.MONGODB);
const tokenHelper = token_helper_1.default(env_1.default, mongo);
Routes.get('/cliente', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const r = yield mongo.db.collection('clientes').find().toArray();
        const cuantos = yield mongo.db.collection('clientes').countDocuments();
        if (!r)
            return res.status(500).json({ ok: false, msg: `No se encontro un cliente` });
        else {
            return res.status(200).json({ ok: true, clientes: r, cuantos });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: `Error en el servidor`
        });
    }
}));
Routes.get('/clienteById/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { id } = req.params;
        let uid = new mongodb_1.default.ObjectID(id);
        const r = yield mongo.db.collection('clientes').findOne({ _id: uid });
        if (!r)
            return res.status(500).json({ ok: false, msg: `No se encontro un cliente` });
        else {
            return res.status(200).json({ ok: true, cliente: r });
        }
    }
    catch (error) {
        return res.status(500).json({
            ok: false,
            msg: `Error en el servidor`
        });
    }
}));
Routes.post('/registrarPlateaOriente', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { item } = req.body;
        for (let j = 0; j < item.length; j++) {
            const r = yield mongo.db.collection('clientes').findOne({ nombreCompleto: item[j].nombre_titular });
            if (r) {
                let bandera = 0;
                for (let i = 0; i < r.titulos.length; i++) {
                    if (r.titulos[i].numeroTitulo == Number(item[j].num_titulo) && r.titulos[i].zona == item[j].zona.toUpperCase()) {
                        bandera = 1;
                    }
                }
                if (bandera == 0) {
                    yield mongo.db.collection('clientes').findOneAndUpdate({
                        _id: r._id
                    }, { $push: { titulos: { numeroTitulo: Number(item[j].num_titulo), zona: item[j].zona.toUpperCase() } } });
                }
            }
            else {
                const result2 = yield mongo.db.collection('clientes').insertOne({
                    nombreCompleto: item[j].nombre_titular, domicilio: null, telefono: null, email: null, codigoPostal: null, estatus: 1, createdDate: new Date(), titulos: [{ numeroTitulo: Number(item[j].num_titulo), zona: item[j].zona.toUpperCase() }]
                });
            }
        }
        return res.status(200).json({ ok: true, msg: "Procedimiento acabado con exito" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: `Error en el servidor`
        });
    }
}));
Routes.post('/registrarPlateaPoniente', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { item } = req.body;
        for (let j = 0; j < item.length; j++) {
            const r = yield mongo.db.collection('clientes').findOne({ nombreCompleto: item[j].titular });
            if (r) {
                let bandera = 0;
                for (let i = 0; i < r.titulos.length; i++) {
                    if (r.titulos[i].numeroTitulo == Number(item[j].numero_ti) && r.titulos[i].zona == item[j].sector.toUpperCase()) {
                        bandera = 1;
                    }
                }
                if (bandera == 0) {
                    yield mongo.db.collection('clientes').findOneAndUpdate({
                        _id: r._id
                    }, { $push: { titulos: { numeroTitulo: Number(item[j].numero_ti), zona: item[j].sector.toUpperCase() } } });
                }
            }
            else {
                const result2 = yield mongo.db.collection('clientes').insertOne({
                    nombreCompleto: item[j].titular, domicilio: null, telefono: null, email: null, codigoPostal: null, estatus: 1, createdDate: new Date(), titulos: [{ numeroTitulo: Number(item[j].numero_ti), zona: item[j].sector.toUpperCase() }]
                });
            }
        }
        return res.status(200).json({ ok: true, msg: "Procedimiento acabado con exito" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: `Error en el servidor`
        });
    }
}));
Routes.post('/registrarPalco', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { item } = req.body;
        for (let j = 0; j < item.length; j++) {
            const r = yield mongo.db.collection('clientes').findOne({ nombreCompleto: item[j].NOMBRE_TITULAR });
            if (r) {
                let bandera = 0;
                for (let i = 0; i < r.titulos.length; i++) {
                    if (r.titulos[i].numeroTitulo == Number(item[j].TITULO) && r.titulos[i].zona == item[j].ZONA.toUpperCase()) {
                        bandera = 1;
                    }
                }
                if (bandera == 0) {
                    yield mongo.db.collection('clientes').findOneAndUpdate({
                        _id: r._id
                    }, { $push: { titulos: { numeroTitulo: Number(item[j].TITULO), zona: item[j].ZONA.toUpperCase() } } });
                }
            }
            else {
                const result2 = yield mongo.db.collection('clientes').insertOne({
                    nombreCompleto: item[j].NOMBRE_TITULAR, domicilio: null, telefono: null, email: null, codigoPostal: null, estatus: 1, createdDate: new Date(), titulos: [{ numeroTitulo: Number(item[j].TITULO), zona: item[j].ZONA.toUpperCase() }]
                });
            }
        }
        return res.status(200).json({ ok: true, msg: "Procedimiento acabado con exito" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: `Error en el servidor`
        });
    }
}));
Routes.post('/cliente', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { nombreCompleto, domicilio, telefono, email, codigoPostal, titulos } = req.body;
    try {
        const result = yield mongo.db.collection('clientes').findOne({ nombreCompleto });
        if (!result) {
            const result2 = yield mongo.db.collection('clientes').insertOne({
                nombreCompleto, domicilio: domicilio, telefono, email, codigoPostal, estatus: 1, createdDate: new Date(), titulos
            });
            return res.status(200).json({
                ok: true,
                msg: `Registro finalizado con exito`
            });
        }
        else {
            return res.status(500).json({
                ok: false,
                msg: `El cliente ${nombreCompleto} ya esta registrado el id es ${result._id}`
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: `Error en el servidor`
        });
    }
}));
Routes.put('/cliente/addContrato/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { id } = req.params;
        let { titulo } = req.body;
        let uid = new mongodb_1.default.ObjectID(id);
        const r = yield mongo.db.collection('clientes').findOne({ _id: uid });
        if (!r)
            return res.status(500).json({ ok: false, msg: `No se encontro un cliente` });
        else {
            const result = yield mongo.db.collection('clientes').findOneAndUpdate({
                _id: uid
            }, { $push: { titulos: titulo } });
            return res.status(200).json({ ok: true, msg: `Se agrego titulo al usuario ${r.nombreCompleto}` });
        }
    }
    catch (error) {
        return res.status(500).json({
            ok: false,
            msg: `Error en el servidor`
        });
    }
}));
exports.default = Routes;
