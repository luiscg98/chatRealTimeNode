import { Router, Request, Response, NextFunction } from 'express';
import env from '../enviroments/env';
import MongooseHelper from '../helpers/mongo.helper'
import bcrypt, { hashSync } from 'bcrypt';
import TokenHelper from '../helpers/token.helper';
import mongoClient from 'mongodb';

const Routes = Router();
const mongo = MongooseHelper.getInstance(env.MONGODB);
const tokenHelper = TokenHelper(env, mongo);

Routes.get('/tarjetaById/:id', async(req:Request,res:Response)=> {

    try {
        const {id}=req.params;
        const r = await mongo.db.collection('accesos').find({}).toArray();
        console.log(bcrypt.hashSync(id,11));

        if(!r)
        return res.status(500).json({ok:false,msg:`No se encontro un cliente`});

        else{
            console.log("entro");
            for (let i = 0; i < r.length; i++) {
                console.log(r[i].uid,i);
                if(bcrypt.compareSync(id,r[i].uid)){
                    return res.status(200).json({ok:true,tarjeta:r[i]});
                }
            }
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:`Error en el servidor`
        })   
    }

});

Routes.post('/registrarTarjetas', async(req:Request,res:Response)=> {

    try {
        let {tarjetas} = req.body;

        for (let i = 0; i < tarjetas.length; i++) {

            tarjetas[i].folio=Number(tarjetas[i].folio);
            
            await mongo.db.collection('accesos').insertOne({
                idButaca:null,
                uid:bcrypt.hashSync(tarjetas[i].UID,11),
                folio:Number(tarjetas[i].FOLIO),
                zona:"Platea Poniente B2",
                estado:0,
                tipo:"Platea"
            });
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

Routes.delete('/tarjetas', async(req:Request,res:Response)=> {

    try {

        let r = await mongo.db.collection('accesos').find({zona:"Platea Poniente B2"}).toArray();

        for (let i = 0; i < r.length; i++) {
            await mongo.db.collection('accesos').deleteOne({_id:r[i]._id});
        }

        return res.status(200).json({ok:true,r});
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:`Error en el servidor`
        })   
    }

});


export default Routes;