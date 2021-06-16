import { Router, Request, Response, NextFunction } from 'express';
import env from '../enviroments/env';
import MongooseHelper from '../helpers/mongo.helper'
import bcrypt from 'bcrypt';
import TokenHelper from '../helpers/token.helper';
import mongoClient from 'mongodb';

const Routes = Router();
const mongo = MongooseHelper.getInstance(env.MONGODB);
const tokenHelper = TokenHelper(env, mongo);

Routes.get('/cliente', async(req:Request,res:Response)=> {

    try {
        const r = await mongo.db.collection('clientes').find().toArray();
        const cuantos = await mongo.db.collection('clientes').countDocuments();

        if(!r)
        return res.status(500).json({ok:false,msg:`No se encontro un cliente`});

        else{
            return res.status(200).json({ok:true,clientes:r, cuantos});
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:`Error en el servidor`
        })   
    }

});

Routes.get('/clienteById/:id', async(req:Request,res:Response)=> {

    try {
        let {id} = req.params;
        let uid= new mongoClient.ObjectID(id);
        const r = await mongo.db.collection('clientes').findOne({_id:uid});

        if(!r)
        return res.status(500).json({ok:false,msg:`No se encontro un cliente`});

        else{
            return res.status(200).json({ok:true,cliente:r});
        }
        
    } catch (error) {
        return res.status(500).json({
            ok:false,
            msg:`Error en el servidor`
        })   
    }

});

Routes.post('/registrarPlateaOriente', async(req:Request,res:Response)=> {

    try {
        let {item} = req.body;

        for (let j = 0; j < item.length; j++) {
            const r = await mongo.db.collection('clientes').findOne({nombreCompleto:item[j].nombre_titular});

            if(r){
                let bandera = 0;
                for (let i = 0; i < r.titulos.length; i++) {
                    if(r.titulos[i].numeroTitulo==Number(item[j].num_titulo) && r.titulos[i].zona==item[j].zona.toUpperCase()){
                        bandera=1;
                    }               
                }

                if(bandera == 0){
                    await mongo.db.collection('clientes').findOneAndUpdate({
                        _id:r._id
                    },
                    { $push: { titulos: {numeroTitulo:Number(item[j].num_titulo),zona:item[j].zona.toUpperCase()} } });

                }
            }

            else{
                const result2: any = await mongo.db.collection('clientes').insertOne({
                    nombreCompleto:item[j].nombre_titular,domicilio:null, telefono:null, email:null, codigoPostal:null, estatus:1, createdDate: new Date(), titulos:[{numeroTitulo:Number(item[j].num_titulo),zona:item[j].zona.toUpperCase()}]
                });
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

Routes.post('/registrarPlateaPoniente', async(req:Request,res:Response)=> {

    try {
        let {item} = req.body;

        for (let j = 0; j < item.length; j++) {
            const r = await mongo.db.collection('clientes').findOne({nombreCompleto:item[j].titular});

            if(r){
                let bandera = 0;
                for (let i = 0; i < r.titulos.length; i++) {
                    if(r.titulos[i].numeroTitulo==Number(item[j].numero_ti) && r.titulos[i].zona==item[j].sector.toUpperCase()){
                        bandera=1;
                    }               
                }

                if(bandera == 0){
                    await mongo.db.collection('clientes').findOneAndUpdate({
                        _id:r._id
                    },
                    { $push: { titulos: {numeroTitulo:Number(item[j].numero_ti),zona:item[j].sector.toUpperCase()} } });

                }
            }

            else{
                const result2: any = await mongo.db.collection('clientes').insertOne({
                    nombreCompleto:item[j].titular,domicilio:null, telefono:null, email:null, codigoPostal:null, estatus:1, createdDate: new Date(), titulos:[{numeroTitulo:Number(item[j].numero_ti),zona:item[j].sector.toUpperCase()}]
                });
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

Routes.post('/registrarPalco', async(req:Request,res:Response)=> {

    try {
        let {item} = req.body;

        for (let j = 0; j < item.length; j++) {
            const r = await mongo.db.collection('clientes').findOne({nombreCompleto:item[j].NOMBRE_TITULAR});

            if(r){
                let bandera = 0;
                for (let i = 0; i < r.titulos.length; i++) {
                    if(r.titulos[i].numeroTitulo==Number(item[j].TITULO) && r.titulos[i].zona==item[j].ZONA.toUpperCase()){
                        bandera=1;
                    }               
                }

                if(bandera == 0){
                    await mongo.db.collection('clientes').findOneAndUpdate({
                        _id:r._id
                    },
                    { $push: { titulos: {numeroTitulo:Number(item[j].TITULO),zona:item[j].ZONA.toUpperCase()} } });

                }
            }

            else{
                const result2: any = await mongo.db.collection('clientes').insertOne({
                    nombreCompleto:item[j].NOMBRE_TITULAR,domicilio:null, telefono:null, email:null, codigoPostal:null, estatus:1, createdDate: new Date(), titulos:[{numeroTitulo:Number(item[j].TITULO),zona:item[j].ZONA.toUpperCase()}]
                });
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

Routes.post('/cliente', async (req:Request, res:Response) => {

    let {nombreCompleto, domicilio, telefono, email, codigoPostal, titulos} = req.body;

    try {
        const result:any = await mongo.db.collection('clientes').findOne({nombreCompleto});

        if (!result){
            const result2: any = await mongo.db.collection('clientes').insertOne({
                nombreCompleto,domicilio:domicilio, telefono, email, codigoPostal, estatus:1, createdDate: new Date(), titulos
            });
            return res.status(200).json({
                ok:true,
                msg:`Registro finalizado con exito`
            });
        }
        else{
            return res.status(500).json({
                ok:false,
                msg:`El cliente ${nombreCompleto} ya esta registrado el id es ${result._id}`
            });
        } 
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:`Error en el servidor`
        });
    }
});

Routes.put('/cliente/addContrato/:id', async(req:Request,res:Response)=> {

    try {
        let {id} = req.params;
        let {titulo}=req.body;
        let uid= new mongoClient.ObjectID(id);
        const r = await mongo.db.collection('clientes').findOne({_id:uid});

        if(!r)
        return res.status(500).json({ok:false,msg:`No se encontro un cliente`});

        else{
            const result: any = await mongo.db.collection('clientes').findOneAndUpdate({
                _id:uid
            },
            { $push: { titulos: titulo } });

            return res.status(200).json({ok:true,msg:`Se agrego titulo al usuario ${r.nombreCompleto}`});
        }
        
    } catch (error) {
        return res.status(500).json({
            ok:false,
            msg:`Error en el servidor`
        })   
    }

});


export default Routes;