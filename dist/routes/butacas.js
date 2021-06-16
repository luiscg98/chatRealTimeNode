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
Routes.get('/butacasNotNull', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { zona } = req.params;
        const r = yield mongo.db.collection('butacas').find({}).sort({ _id: 1 }).toArray();
        let arreglo = [];
        if (!r)
            return res.status(500).json({ ok: false, msg: `No se encontraron butacas` });
        else {
            let a = 0;
            for (let i = 0; i < r.length; i++) {
                console.log(r[i].cliente);
                if (r[i].cliente != null) {
                    arreglo[a] = r[i]._id;
                    a++;
                }
            }
            return res.status(200).json({ ok: true, arreglo });
        }
    }
    catch (error) {
        return res.status(500).json({
            ok: false,
            msg: `Error en el servidor`
        });
    }
}));
Routes.get('/butacasByZona/:zona', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { zona } = req.params;
        const r = yield mongo.db.collection('butacas').find({ zona }).sort({ _id: 1 }).toArray();
        if (!r)
            return res.status(500).json({ ok: false, msg: `No se encontraron butacas` });
        else {
            return res.status(200).json({ ok: true, butacas: r });
        }
    }
    catch (error) {
        return res.status(500).json({
            ok: false,
            msg: `Error en el servidor`
        });
    }
}));
Routes.get('/butacasByZonas/:zona1/:zona2', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { zona1, zona2 } = req.params;
        const r = yield mongo.db.collection('butacas').find({ $or: [{ zona: zona1 }, { zona: zona2 }] }).sort({ _id: 1 }).toArray();
        if (!r)
            return res.status(500).json({ ok: false, msg: `No se encontraron butacas` });
        else {
            return res.status(200).json({ ok: true, butacas: r });
        }
    }
    catch (error) {
        return res.status(500).json({
            ok: false,
            msg: `Error en el servidor`
        });
    }
}));
Routes.get('/butacasByZonasInverso/:zona1/:zona2', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { zona1, zona2 } = req.params;
        const r = yield mongo.db.collection('butacas').find({ $or: [{ zona: zona1 }, { zona: zona2 }] }).sort({ identificador: 1 }).toArray();
        if (!r)
            return res.status(500).json({ ok: false, msg: `No se encontraron butacas` });
        else {
            return res.status(200).json({ ok: true, butacas: r });
        }
    }
    catch (error) {
        return res.status(500).json({
            ok: false,
            msg: `Error en el servidor`
        });
    }
}));
Routes.get('/butacasById/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
Routes.post('/butacasPlateas', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { fila, asientos, seccion, zona } = req.body;
        for (let i = 0; i < asientos; i++) {
            yield mongo.db.collection('butacas').insertOne({ seccion, zona, fila, numeroButaca: i + 1, estado: 0, precio: 1500, uid: null, cliente: null, identificador: `${seccion}. Sector ${zona}, Fila ${fila}, Butaca ${i + 1}` });
        }
        return res.status(201).json({ ok: true, msg: `${asientos.length} butacas creadas de ${seccion} con sector ${zona}, fila ${fila}` });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ ok: false, msg: `Error en el servidor` });
    }
}));
Routes.post('/butacasPlateasEspeciales', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let fila;
    let asientos = 0;
    try {
        for (let i = 21; i < 34; i++) {
            for (let index = 0; index < 5; index++) {
                if (index == 0) {
                    fila = "A";
                }
                if (index == 1) {
                    fila = "B";
                }
                if (index == 2) {
                    fila = "C";
                }
                if (index == 3) {
                    fila = "D";
                }
                if (index == 4) {
                    fila = "E";
                }
                for (let j = 0; j < 6; j++) {
                    yield mongo.db.collection('butacas').insertOne({ seccion: "Platea Ote", zona: (i + 1).toString(), fila, numeroButaca: j + 1, estado: 0, precio: 2500, uid: null, cliente: null, identificador: `Platea Ote. Sector ${i + 1}, Fila ${fila}, Butaca ${j + 1}` });
                    asientos = asientos + 1;
                }
            }
        }
        return res.status(201).json({ ok: true, msg: `${asientos} butacas creadas` });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ ok: false, msg: `Error en el servidor` });
    }
}));
Routes.put('/changePrice', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { price } = req.body;
    try {
        let butacas = yield mongo.db.collection('butacas').find({ $or: [{ seccion: "Platea Ote" }, { seccion: "Platea Pte" }] }).toArray();
        let counts = yield mongo.db.collection('butacas').countDocuments({ $or: [{ seccion: "Platea Ote" }, { seccion: "Platea Pte" }] });
        for (let index = 0; index < counts; index++) {
            butacas[index].precio = price;
            yield mongo.db.collection('butacas').replaceOne({ _id: new mongodb_1.default.ObjectID(butacas[index]._id) }, butacas[index]);
        }
        return res.status(201).json({ ok: true, counts, butacas });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ ok: false, msg: `Error en el servidor` });
    }
}));
exports.default = Routes;
