import { Socket } from "socket.io";
import jwt from 'jsonwebtoken';
import TokenHelper from '../helpers/token.helper';
import MongoHelper from '../helpers/mongo.helper';
import ENV from '../enviroments/env';
import mongoClient from 'mongodb';

const mongo = MongoHelper.getInstance(ENV.MONGODB);
const tokenHelper=TokenHelper(ENV,mongo);

export default (mongo: any) => {

    return {
        actualizarSocket: async(io:any,socket: Socket) => {
            socket.on('actualizarSocket', async(payload:any)=>{

                try {
                    let result :any= await tokenHelper.verify(payload.token,payload.apiKey);
                    if(result.ok==true){
                        await mongo.db.collection('sockets').insertOne({
                            socketId:socket.id,
                            usuario:result.tokenDecoded.usuario,
                        });
                    }

                } catch (error) {
                    console.log(error);
                }
                
            });
        },
        actualizarButacaSelecconada: async(io:any,socket:Socket) => {
            socket.on('c2Seleccionada', async(payload:any) => {
                try {
                    console.log(payload);
                    if(payload.modo==1){
                        for (let i = 0; i < payload.resultado.length; i++) {
                            let uid= new mongoClient.ObjectID(payload.resultado[i]._id);
                            let butaca = await mongo.db.collection('butacas').findOne({_id:uid});
                            if(butaca){
                                await mongo.db.collection('butacas').findOneAndUpdate({_id:uid},{$set:{estado:payload.resultado[i].estado}});
                                io.emit('c2Actualizar',{resultado:payload.resultado[i]});
                            }
                        }
                    }
                    else{
                        for (let i = 0; i < payload.butacas.length; i++) {
                            payload.butacas[i].butaca.estado=2;
                            io.emit('c2Actualizar',{resultado:payload.butacas[i].butaca});
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            });
        },
        signIn: (io: any, socket: Socket) => {
            socket.on('signIn', async (payload: any) => {
                // Guardar en Base de Datos

                try {
                    await mongo.db.collection('sockets')
                    .insertOne(
                        { socketId: socket.id, usuario:payload.usuario}
                    )
                } catch (error) {
                    console.log(error);
                }
                
            });
        },
        logOut: (io:any,socket:Socket) => {
            socket.on('logOut',async (payload:any)=>{
                try {
                    let token:any = await tokenHelper.verify(payload.token,payload.apikey);
                    if(token.ok == true){
                        await mongo.db.collection('sockets').findOneAndDelete({usuario:token.tokenDecoded.usuario});
                    }
                } catch (error) {
                    console.log(error);
                }
            });
        },
        disconnect: (io:any,socket: Socket) => {
            socket.on('disconnect', async () => {

                try {
                    console.log(`Desconexión del cliente con ID: ${socket.id}`);
                    // Eliminar Socket Desconectado
                    let result = await mongo.db.collection('sockets').findOneAndDelete({socketId: socket.id});
                } catch (error) {
                    console.log(error);
                }
                // TO DO: Guardar Log en Base de Datos
            });
        }
    }
};