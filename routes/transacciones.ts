import { Router, Request, Response, NextFunction } from 'express';
import env from '../enviroments/env';
import MongooseHelper from '../helpers/mongo.helper'
import bcrypt, { hashSync } from 'bcrypt';
import TokenHelper from '../helpers/token.helper';
import mongoClient from 'mongodb';

const Routes = Router();
const mongo = MongooseHelper.getInstance(env.MONGODB);
const tokenHelper = TokenHelper(env, mongo);

Routes.post('/pagar', async(req:Request,res:Response)=> {

    try {

        let{transaccion,cliente}=req.body;

        for (let i = 0; i < transaccion.length; i++) {
            let tarjeta = await mongo.db.collection('accesos').findOne({$and:[{folio:transaccion[i].tarjeta.folio},{zona:transaccion[i].tarjeta.sector}]});
            let butaca = await mongo.db.collection('butacas').findOne({_id:new mongoClient.ObjectID(transaccion[i].butaca._id)});

            if((tarjeta && tarjeta.idButaca==null && tarjeta.estado==0) && (butaca && butaca.estado!=2 && butaca.cliente==null)){
                await mongo.db.collection('accesos').findOneAndUpdate({_id:tarjeta._id},{$set:{estado:1,idButaca:new mongoClient.ObjectID(butaca._id)}});
                await mongo.db.collection('butacas').findOneAndUpdate({_id:butaca._id},{$set:{estado:2,cliente: new mongoClient.ObjectID(cliente)}})
            }

            else{
                return res.status(500).json({ok:false,msg:`Sucedio algo mal en la transacción`});
            }
        }

        return res.status(200).json({ok:true, msg:"Procedimiento acabado con exito"});
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:`Error en el servidor`
        })   
    }

});


export default Routes;