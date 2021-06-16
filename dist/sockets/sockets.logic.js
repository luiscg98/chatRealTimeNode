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
const token_helper_1 = __importDefault(require("../helpers/token.helper"));
const mongo_helper_1 = __importDefault(require("../helpers/mongo.helper"));
const env_1 = __importDefault(require("../enviroments/env"));
const mongodb_1 = __importDefault(require("mongodb"));
const mongo = mongo_helper_1.default.getInstance(env_1.default.MONGODB);
const tokenHelper = token_helper_1.default(env_1.default, mongo);
exports.default = (mongo) => {
    return {
        actualizarSocket: (io, socket) => __awaiter(void 0, void 0, void 0, function* () {
            socket.on('actualizarSocket', (payload) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    let result = yield tokenHelper.verify(payload.token, payload.apiKey);
                    if (result.ok == true) {
                        yield mongo.db.collection('sockets').insertOne({
                            socketId: socket.id,
                            usuario: result.tokenDecoded.usuario,
                        });
                    }
                }
                catch (error) {
                    console.log(error);
                }
            }));
        }),
        actualizarButacaSelecconada: (io, socket) => __awaiter(void 0, void 0, void 0, function* () {
            socket.on('c2Seleccionada', (payload) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    console.log(payload);
                    if (payload.modo == 1) {
                        for (let i = 0; i < payload.resultado.length; i++) {
                            let uid = new mongodb_1.default.ObjectID(payload.resultado[i]._id);
                            let butaca = yield mongo.db.collection('butacas').findOne({ _id: uid });
                            if (butaca) {
                                yield mongo.db.collection('butacas').findOneAndUpdate({ _id: uid }, { $set: { estado: payload.resultado[i].estado } });
                                io.emit('c2Actualizar', { resultado: payload.resultado[i] });
                            }
                        }
                    }
                    else {
                        for (let i = 0; i < payload.butacas.length; i++) {
                            payload.butacas[i].butaca.estado = 2;
                            io.emit('c2Actualizar', { resultado: payload.butacas[i].butaca });
                        }
                    }
                }
                catch (error) {
                    console.log(error);
                }
            }));
        }),
        signIn: (io, socket) => {
            socket.on('signIn', (payload) => __awaiter(void 0, void 0, void 0, function* () {
                // Guardar en Base de Datos
                try {
                    yield mongo.db.collection('sockets')
                        .insertOne({ socketId: socket.id, usuario: payload.usuario });
                }
                catch (error) {
                    console.log(error);
                }
            }));
        },
        logOut: (io, socket) => {
            socket.on('logOut', (payload) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    let token = yield tokenHelper.verify(payload.token, payload.apikey);
                    if (token.ok == true) {
                        yield mongo.db.collection('sockets').findOneAndDelete({ usuario: token.tokenDecoded.usuario });
                    }
                }
                catch (error) {
                    console.log(error);
                }
            }));
        },
        disconnect: (io, socket) => {
            socket.on('disconnect', () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    console.log(`Desconexión del cliente con ID: ${socket.id}`);
                    // Eliminar Socket Desconectado
                    let result = yield mongo.db.collection('sockets').findOneAndDelete({ socketId: socket.id });
                }
                catch (error) {
                    console.log(error);
                }
                // TO DO: Guardar Log en Base de Datos
            }));
        }
    };
};
