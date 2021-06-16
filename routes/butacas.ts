import { Router, Request, Response, NextFunction } from 'express';
import env from '../enviroments/env';
import MongooseHelper from '../helpers/mongo.helper'
import bcrypt from 'bcrypt';
import TokenHelper from '../helpers/token.helper';
import mongoClient from 'mongodb';
import MongoDBHelper from '../helpers/mongo.helper';

const Routes = Router();
const mongo = MongooseHelper.getInstance(env.MONGODB);
const tokenHelper = TokenHelper(env, mongo);

Routes.get('/butacasNotNull', async(req:Request,res:Response)=> {

    try {
        let {zona} = req.params;
        const r = await mongo.db.collection('butacas').find({}).sort({_id: 1}).toArray();
        let arreglo=[];

        if(!r)
        return res.status(500).json({ok:false,msg:`No se encontraron butacas`});

        else{
            let a=0;
            for (let i = 0; i < r.length; i++) {
                console.log(r[i].cliente);
                if(r[i].cliente!=null){
                    arreglo[a]=r[i]._id;
                    a++;
                }
                
            }
            return res.status(200).json({ok:true,arreglo});
        }
        
    } catch (error) {
        return res.status(500).json({
            ok:false,
            msg:`Error en el servidor`
        })   
    }

});

Routes.get('/butacasByZona/:zona', async(req:Request,res:Response)=> {

    try {
        let {zona} = req.params;
        const r = await mongo.db.collection('butacas').find({zona}).sort({_id: 1}).toArray();

        if(!r)
        return res.status(500).json({ok:false,msg:`No se encontraron butacas`});

        else{
            return res.status(200).json({ok:true,butacas:r});
        }
        
    } catch (error) {
        return res.status(500).json({
            ok:false,
            msg:`Error en el servidor`
        })   
    }

});

Routes.get('/butacasByZonas/:zona1/:zona2', async(req:Request,res:Response)=> {

    try {
        let {zona1, zona2} = req.params;
        const r = await mongo.db.collection('butacas').find({$or:[{ zona: zona1 }, { zona:zona2 } ]}).sort({_id: 1}).toArray();

        if(!r)
        return res.status(500).json({ok:false,msg:`No se encontraron butacas`});

        else{
            return res.status(200).json({ok:true,butacas:r});
        }
        
    } catch (error) {
        return res.status(500).json({
            ok:false,
            msg:`Error en el servidor`
        })   
    }

});

Routes.get('/butacasByZonasInverso/:zona1/:zona2', async(req:Request,res:Response)=> {

    try {
        let {zona1, zona2} = req.params;
        const r = await mongo.db.collection('butacas').find({$or:[{ zona: zona1 }, { zona:zona2 } ]}).sort({identificador: 1}).toArray();

        if(!r)
        return res.status(500).json({ok:false,msg:`No se encontraron butacas`});

        else{
            return res.status(200).json({ok:true,butacas:r});
        }
        
    } catch (error) {
        return res.status(500).json({
            ok:false,
            msg:`Error en el servidor`
        })   
    }

});

Routes.get('/butacasById/:id', async(req:Request,res:Response)=> {

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

Routes.post('/butacasPlateas',async(req:Request, res:Response) => {

    try {
        let {fila,asientos,seccion,zona} = req.body;
        for (let i = 0; i < asientos; i++) {
            await mongo.db.collection('butacas').insertOne({seccion,zona,fila,numeroButaca:i+1,estado:0,precio:1500,uid:null,cliente:null, identificador:`${seccion}. Sector ${zona}, Fila ${fila}, Butaca ${i+1}`});
        }

        return res.status(201).json({ok:true, msg:`${asientos.length} butacas creadas de ${seccion} con sector ${zona}, fila ${fila}`});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ok:false, msg:`Error en el servidor`});
    }

});

Routes.post('/butacasPlateasEspeciales',async(req:Request, res:Response) => {

    let fila;
    let asientos=0;

    try {
        for (let i = 21; i < 34; i++) {
            for (let index = 0; index < 5; index++) {
                if(index==0){
                    fila="A";
                }
                if(index==1){
                    fila="B";
                }
                if(index==2){
                    fila="C";
                }
                if(index==3){
                    fila="D";
                }
                if(index==4){
                    fila="E";
                }
                for (let j = 0; j < 6; j++) {
                    await mongo.db.collection('butacas').insertOne({seccion:"Platea Ote",zona:(i+1).toString(),fila,numeroButaca:j+1,estado:0,precio:2500,uid:null,cliente:null, identificador:`Platea Ote. Sector ${i+1}, Fila ${fila}, Butaca ${j+1}`});
                    asientos=asientos+1;
                }
            }
        }

        return res.status(201).json({ok:true, msg:`${asientos} butacas creadas`});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ok:false, msg:`Error en el servidor`});
    }

});

Routes.put('/changePrice',async(req:Request, res:Response) => {

    let {price} = req.body;

    try {
        let butacas = await mongo.db.collection('butacas').find({$or:[{ seccion: "Platea Ote" }, { seccion:"Platea Pte" } ]}).toArray();
        let counts = await mongo.db.collection('butacas').countDocuments({$or:[{ seccion: "Platea Ote" }, { seccion:"Platea Pte" } ]});
        for (let index = 0; index < counts; index++) {
            butacas[index].precio=price;
            await mongo.db.collection('butacas').replaceOne({_id:new mongoClient.ObjectID(butacas[index]._id)},butacas[index]);
        }
        return res.status(201).json({ok:true, counts, butacas});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ok:false, msg:`Error en el servidor`});
    }

});

export default Routes;