"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const registro_1 = __importDefault(require("./registro"));
const clientes_1 = __importDefault(require("./clientes"));
const butacas_1 = __importDefault(require("./butacas"));
const tarjetas_1 = __importDefault(require("./tarjetas"));
const transacciones_1 = __importDefault(require("./transacciones"));
const app = express_1.default();
app.use(clientes_1.default);
app.use(registro_1.default);
app.use(butacas_1.default);
app.use(tarjetas_1.default);
app.use(transacciones_1.default);
exports.default = app;
