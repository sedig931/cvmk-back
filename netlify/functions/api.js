import express from "express";
import serverless from 'serverless-http';

const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongodbsession = require('connect-mongodb-session')(session);
const cvmkRoute = require('./branchs/cvServeBranch/braRoute.js');

const cors = require('cors');
const api = express();

require('./database/connect.js');
require('./strategies/local.js');

api.use(cors({
    origin: 'https://samdtc931.com',
    methods: ['POST', 'GET', 'DELETE'],
    credentials: true,
}));

api.use('/uploads', express.static("./uploads"));

api.use(express.json());
api.use(express.urlencoded());
api.use(cookieParser());
api.use(session({
    secret: 'AGHDGAHDA',
    resave: false,
    saveUninitialized: false,
    store: new mongodbsession({
        uri: "mongodb+srv://sedig931:mongodbsiddigA5735354@salesclustor.0bmk5.mongodb.net/market_project?retryWrites=true&w=majority&appName=SalesClustor",
        collection: "mySessions"
    }),
}));
api.use(passport.initialize());
api.use(passport.session());
api.get('/api/destroy', (req, res) => {
    req.session.destroy();
    // console.log(req.);
    res.send(200);
});

api.use("/api", cvmkRoute);

export const handler = serverless(api);