// main.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import https from 'https';
import sequelize from './utils/db.js';
import Logger from './utils/logger.js';

import Role from './models/Role.js';
import User from './models/User.js';
import Grant from './models/Grant.js';
import RoleGrant from './models/RoleGrant.js';

// Sync delle tabelle
User.sync();

// Caricamento delle variabili d'ambiente
dotenv.config();
const port = process.env.PORT || 3000;

// Inizializzazione dell'applicazione
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
import router from './routes/router.js';

app.use('/', router);

// Server
const httpServer = http.createServer(app);
const httpsServer = https.createServer(app);

if(process.env.ssl === 'true') {
    httpsServer.listen(port, () => {
        Logger('success', 'HTTPS Server running on port ' + port);
    });
} else {
    httpServer.listen(port, () => {
        Logger('success', 'HTTP Server running on port ' + port);
        });
}