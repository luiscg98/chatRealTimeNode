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
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_helper_1 = __importDefault(require("../helpers/token.helper"));
const Routes = express_1.Router();
const mongo = mongo_helper_1.default.getInstance(env_1.default.MONGODB);
const tokenHelper = token_helper_1.default(env_1.default, mongo);
Routes.post('/registro', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { usuario, contraseña, role } = req.body;
    try {
        const result = yield mongo.db.collection('usuarios').findOne({ usuario });
        if (!result) {
            const result2 = yield mongo.db.collection('usuarios').insertOne({
                usuario, contrasena: bcrypt_1.default.hashSync(contraseña, 11), createdDate: new Date(), role
            });
            return res.status(200).json({
                ok: true,
                msg: `Registro finalizado con exito`
            });
        }
        else {
            return res.status(500).json({
                ok: false,
                msg: `El correo ${usuario} ya esta registrado`
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            ok: false,
            msg: `Error en el servidor`
        });
    }
}));
Routes.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { usuario, contraseña, trabajador, apikey } = req.body;
    try {
        const result = yield mongo.db.collection('usuarios').findOne({ usuario });
        if (result) {
            if (!bcrypt_1.default.compareSync(contraseña, result.contrasena)) {
                return res.status(401).json({
                    ok: false,
                    msg: `Credenciales incorrectas`
                });
            }
            if (!(result.sesion == undefined || result.sesion == null)) {
                console.log("otro dispositivo");
                return res.status(401).json({
                    ok: false,
                    msg: `Sesión iniciada en otro dispositivo`
                });
            }
            result.sesion = [{ inicioSesion: new Date() }];
            mongo.db.collection('usuarios').replaceOne({ _id: result._id }, result);
            const token = yield tokenHelper.create({ usuario, trabajador, role: result.role }, apikey);
            return res.status(200).json({
                ok: true,
                token: token.token
            });
        }
        else {
            return res.status(401).json({
                ok: false,
                msg: `Credenciales incorrectas`
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
Routes.post('/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { usuario } = req.body;
    try {
        const result = yield mongo.db.collection('usuarios').findOne({ usuario });
        if (result) {
            result.sesion = null;
            mongo.db.collection('usuarios').replaceOne({ _id: result._id }, result);
            return res.status(200).json({ ok: true, msg: 'Cierre de sesión exitoso' });
        }
        else {
            return res.status(500).json({
                ok: false,
                msg: `No se encontro el usuario ${usuario}`
            });
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
