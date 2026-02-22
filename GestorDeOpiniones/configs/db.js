'use strict';

import mongoose from "mongoose";

//funcion para conectarse a la base de datos
export const dbConnection = async () => {
    try {
        //Errores
        mongoose.connection.on('error', () => {
            console.log('MongoDB | no se pudo conectar a mongoDB');
            mongoose.disconnect();
        });
        //Se ejecuta cuando no intentamos contecnar
        mongoose.connection.on('connecting', () => {
            console.log('MongoDB | intentando conectar a mongoDB');
        });
        //Se ejecuta cuando nos conectamos
        mongoose.connection.on('connected', () => {
            console.log('MongoDB | conectado a mongoDB');
        });
        //Se ejecuta cuando la conexion se abre 
        mongoose.connection.on('open', () => {
            console.log('MongoDB | conectado a la base de datos GestordeOpinionesDB');
        });
        //Se ejecuta cuando nos reconectamos
        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB | reconectando a mongoDB');
        });
        //Se ejecuta cuando no desconectamos
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB | desconectando a mongoDB');
        });
        //Hacemos la conexion usando la varibale de entoreno
        await mongoose.connect(process.env.URI_MONGO, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10
        })
    } catch (error) {
        console.log(`Error al conectar la db: ${error}`);
    }
}

//Funcion para cerrar la conexion 
const gracefullShutdown = async (signal) => {
    console.log(`MongoDB | Received ${signal}. Closing database connection...`);
    try {
        //Cerramos la conexion
        await mongoose.disconnect();
        console.log('MongoDB | Database connection closed succesfully');
        process.exit(0); //Finaliza el proceso
    } catch (error) {
        console.error('MongoDB | Error during graceful shutdown:', error.message);
        process.exit(1); //Finaliza el proceseo con error
    }
}

//Señales del sistema para cerrar la app
process.on('SIGINT', () => gracefullShutdown('SIGINT'));
process.on('SIGTERM', () => gracefullShutdown('SIGTERM'));
process.on('SIGUSR2', () => gracefullShutdown('SIGUSR2'));