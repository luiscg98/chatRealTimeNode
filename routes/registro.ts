import { Router, Request, Response, NextFunction } from 'express';
import env from '../enviroments/env';
import MongooseHelper from '../helpers/mongo.helper'
import bcrypt from 'bcrypt';
import TokenHelper from '../helpers/token.helper';

const Routes = Router();
const mongo = MongooseHelper.getInstance(env.MONGODB);
const tokenHelper = TokenHelper(env, mongo);

Routes.post('/registro', async (req:Request, res:Response) => {

    let {usuario,contraseña,role} = req.body;

    try {
        const result:any = await mongo.db.collection('usuarios').findOne({usuario});

        if (!result){
            const result2: any = await mongo.db.collection('usuarios').insertOne({
                usuario,contrasena:bcrypt.hashSync(contraseña,11), createdDate:new Date(), role
            });
            return res.status(200).json({
                ok:true,
                msg:`Registro finalizado con exito`
            });
        }
        else{
            return res.status(500).json({
                ok:false,
                msg:`El correo ${usuario} ya esta registrado`
            });
        } 
    } catch (error) {
        return res.status(500).json({
            ok:false,
            msg:`Error en el servidor`
        });
    }
});

Routes.post('/login', async (req:Request, res:Response) => {

    let {usuario,contraseña,trabajador,apikey} = req.body;

    try {
        const result:any = await mongo.db.collection('usuarios').findOne({usuario});

        if (result){
            if(!bcrypt.compareSync(contraseña,result.contrasena)){
                return res.status(401).json({
                    ok:false,
                    msg:`Credenciales incorrectas`
                });
            }

            if(!(result.sesion == undefined || result.sesion == null)){
                console.log("otro dispositivo");
                return res.status(401).json({
                    ok:false,
                    msg:`Sesión iniciada en otro dispositivo`
                });
            }

            result.sesion=[{inicioSesion:new Date()}];

            mongo.db.collection('usuarios').replaceOne({_id:result._id},result);
            

            const token:any = await tokenHelper.create({usuario,trabajador,role:result.role},apikey);

            return res.status(200).json({
                ok:true,
                token:token.token
            });
        }
        else{
            return res.status(401).json({
                ok:false,
                msg:`Credenciales incorrectas`
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

Routes.post('/logout', async (req:Request, res:Response) => {

    let {usuario} = req.body;

    try {
        const result:any = await mongo.db.collection('usuarios').findOne({usuario});
        if (result){
            result.sesion=null;
            mongo.db.collection('usuarios').replaceOne({_id:result._id},result);
            return res.status(200).json({ok:true,msg:'Cierre de sesión exitoso'});
        }
        else{
            return res.status(500).json({
                ok:false,
                msg:`No se encontro el usuario ${usuario}`
            });
        } 
    } catch (error) {
        return res.status(500).json({
            ok:false,
            msg:`Error en el servidor`
        });
    }
});

export default Routes;