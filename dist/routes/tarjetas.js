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
Routes.get('/tarjetaById/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const r = yield mongo.db.collection('accesos').find({}).toArray();
        console.log(bcrypt_1.default.hashSync(id, 11));
        if (!r)
            return res.status(500).json({ ok: false, msg: `No se encontro un cliente` });
        else {
            console.log("entro");
            for (let i = 0; i < r.length; i++) {
                console.log(r[i].uid, i);
                if (bcrypt_1.default.compareSync(id, r[i].uid)) {
                    return res.status(200).json({ ok: true, tarjeta: r[i] });
                }
            }
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
Routes.post('/registrarTarjetas', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { tarjetas } = req.body;
        for (let i = 0; i < tarjetas.length; i++) {
            tarjetas[i].folio = Number(tarjetas[i].folio);
            yield mongo.db.collection('accesos').insertOne({
                idButaca: null,
                uid: bcrypt_1.default.hashSync(tarjetas[i].UID, 11),
                folio: Number(tarjetas[i].FOLIO),
                zona: "Platea Poniente B2",
                estado: 0,
                tipo: "Platea"
            });
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
Routes.delete('/tarjetas', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let r = yield mongo.db.collection('accesos').find({ zona: "Platea Poniente B2" }).toArray();
        for (let i = 0; i < r.length; i++) {
            yield mongo.db.collection('accesos').deleteOne({ _id: r[i]._id });
        }
        return res.status(200).json({ ok: true, r });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: `Error en el servidor`
        });
    }
}));
exports.default = Routes;
