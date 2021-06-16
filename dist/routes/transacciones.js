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
Routes.post('/pagar', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { transaccion, cliente } = req.body;
        for (let i = 0; i < transaccion.length; i++) {
            let tarjeta = yield mongo.db.collection('accesos').findOne({ $and: [{ folio: transaccion[i].tarjeta.folio }, { zona: transaccion[i].tarjeta.sector }] });
            let butaca = yield mongo.db.collection('butacas').findOne({ _id: new mongodb_1.default.ObjectID(transaccion[i].butaca._id) });
            if ((tarjeta && tarjeta.idButaca == null && tarjeta.estado == 0) && (butaca && butaca.estado != 2 && butaca.cliente == null)) {
                yield mongo.db.collection('accesos').findOneAndUpdate({ _id: tarjeta._id }, { $set: { estado: 1, idButaca: new mongodb_1.default.ObjectID(butaca._id) } });
                yield mongo.db.collection('butacas').findOneAndUpdate({ _id: butaca._id }, { $set: { estado: 2, cliente: new mongodb_1.default.ObjectID(cliente) } });
            }
            else {
                return res.status(500).json({ ok: false, msg: `Sucedio algo mal en la transacción` });
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
exports.default = Routes;
