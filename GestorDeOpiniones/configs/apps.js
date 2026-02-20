'use strict'

import express, { response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './db.js';
import { corsOptions } from './cors-configuration.js';
import { helmetConfiguration } from './helmet-configuration.js';

import comentarioRoutes from '../src/comentarios/comentario.routes.js';
import publicacionRoutes from '../src/publicaciones/publicacion.routes.js';

const BASE_PATH = '/api/v1';

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false, limit: '10mb' }));
    app.use(express.json({ limit: '10mb' }));
    app.use(cors(corsOptions));
    app.use(helmet(helmetConfiguration));
    app.use(morgan('dev'));
}

const routes = (app) => {
    app.use(`${BASE_PATH}/comentario`, comentarioRoutes);
    app.use(`${BASE_PATH}/publicacion`, publicacionRoutes);


    app.get(`${BASE_PATH}/Health`, (request, response) => {
        response.status(200).json({
            status: 'Healthy',
            timestamp: new Date().toISOString(),
            service: 'Gestor de Opiniones API'
        })
    })

    app.use((req, res) => {
        res.status(404).json({
            succes: false,
            message: 'Endpoint no encontrado'
        })
    })
}

export const initServer = async () => {
    const app = express();
    const PORT = process.env.PORT;
    app.set('trus proxy', 1);

    try {
        await dbConnection();
        middlewares(app);
        routes(app);

        app.listen(PORT, () => {
            console.log(`Gestor de Opiniones Admin Server running on port ${PORT}`);
            console.log(`Health check: http://localhost:${PORT}${BASE_PATH}/health`);
        })
    } catch (error) {
        console.error(`Error starting Admin Server: ${error.message}`);
        process.exit(1);
    }
}