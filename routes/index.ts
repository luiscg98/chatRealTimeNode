import express from 'express';
import registro from './registro';
import clientes from './clientes';
import butacas from './butacas';
import tarjetas from './tarjetas';
import transacciones from './transacciones';

const app = express();

app.use(clientes);
app.use(registro);
app.use(butacas);
app.use(tarjetas);
app.use(transacciones);


export default app;